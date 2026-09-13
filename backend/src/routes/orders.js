import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { getSupabaseAdmin, getSupabaseUser } from '../lib/supabase.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

const router = Router();
router.use(requireAuth);

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.expose = true;
  return error;
}

function orderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `PO-${date}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { data, error } = await getSupabaseUser(req.accessToken)
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ orders: data || [] });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { data, error } = await getSupabaseUser(req.accessToken)
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', req.params.id)
      .eq('customer_id', req.user.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Order not found.' });
    res.json({ order: data });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { items, company, notes } = req.body;
    if (!Array.isArray(items) || !items.length) throw badRequest('At least one order item is required.');
    if (!company || typeof company !== 'object') throw badRequest('Company and delivery details are required.');

    const admin = getSupabaseAdmin();
    const productIds = [...new Set(items.map((item) => item?.product_id || item?.productId))];
    if (productIds.some((id) => !id)) throw badRequest('Every item must include a product id.');
    const { data: products, error: productError } = await admin
      .from('products')
      .select('id, name, sku, minimum_order_qty')
      .in('id', productIds)
      .eq('is_active', true);
    if (productError) throw productError;
    if ((products || []).length !== productIds.length) throw badRequest('One or more products are unavailable.');

    const { data: prices, error: priceError } = await admin
      .from('product_prices')
      .select('*')
      .in('product_id', productIds)
      .lte('effective_from', new Date().toISOString())
      .or(`effective_to.is.null,effective_to.gt.${new Date().toISOString()}`)
      .order('effective_from', { ascending: false });
    if (priceError) throw priceError;
    const priceMap = {};
    (prices || []).forEach((price) => {
      if (!priceMap[price.product_id]) priceMap[price.product_id] = price;
    });
    const productMap = Object.fromEntries(products.map((product) => [product.id, product]));
    const orderItems = items.map((item) => {
      const productId = item?.product_id || item?.productId;
      const quantity = Number(item?.requested_qty ?? item?.qty);
      const product = productMap[productId];
      const price = Number(priceMap[productId]?.price);
      if (!Number.isFinite(quantity) || quantity <= 0) throw badRequest('Item quantities must be positive numbers.');
      if (product.minimum_order_qty && quantity < Number(product.minimum_order_qty)) {
        throw badRequest(`${product.name} requires a minimum quantity of ${product.minimum_order_qty}.`);
      }
      if (!Number.isFinite(price)) throw badRequest(`${product.name} does not have an active price.`);
      return {
        product_id: productId,
        product_name_snapshot: product.name,
        sku_snapshot: product.sku,
        requested_qty: quantity,
        unit_price_at_request: price,
        line_total: Number((quantity * price).toFixed(2)),
      };
    });
    const subtotal = Number(orderItems.reduce((sum, item) => sum + item.line_total, 0).toFixed(2));

    const companyPayload = {
      profile_id: req.user.id,
      company_name: String(company.company_name || '').trim(),
      email: String(company.email || req.user.email || '').trim(),
      phone_number: String(company.phone_number || '').trim(),
      tax_number: String(company.tax_number || '').trim() || null,
      billing_address: String(company.billing_address || '').trim(),
      shipping_address: String(company.shipping_address || '').trim(),
      city: String(company.city || '').trim(),
      state: String(company.state || '').trim(),
      country: String(company.country || 'India').trim(),
      postal_code: String(company.postal_code || '').trim(),
      updated_at: new Date().toISOString(),
    };
    if (!companyPayload.company_name || !companyPayload.email || !companyPayload.billing_address ||
        !companyPayload.shipping_address || !companyPayload.city || !companyPayload.state ||
        !companyPayload.postal_code) {
      throw badRequest('Complete company and address details are required.');
    }

    const { data: existingCompany } = await admin
      .from('customer_companies')
      .select('id')
      .eq('profile_id', req.user.id)
      .maybeSingle();
    const companyResult = existingCompany
      ? await admin.from('customer_companies').update(companyPayload).eq('profile_id', req.user.id)
      : await admin.from('customer_companies').insert(companyPayload);
    if (companyResult.error) throw companyResult.error;

    const number = orderNumber();
    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        order_number: number,
        customer_id: req.user.id,
        status: 'pending',
        subtotal,
        tax_amount: 0,
        discount_amount: 0,
        total_amount: subtotal,
        notes: typeof notes === 'string' ? notes.trim() || null : null,
      })
      .select()
      .single();
    if (orderError) throw orderError;

    const { error: itemsError } = await admin
      .from('order_items')
      .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));
    if (itemsError) {
      await admin.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    await admin.from('notifications').insert({
      user_id: req.user.id,
      type: 'order_submitted',
      subject: `Order Request Submitted: ${number}`,
      message: `Your purchase order request ${number} for INR ${subtotal.toFixed(2)} has been submitted successfully.`,
      related_order_id: order.id,
    });
    const emailResult = await sendOrderConfirmationEmail({
      to: companyPayload.email,
      orderNumber: number,
      totalAmount: subtotal,
    });
    res.status(201).json({ order: { ...order, order_items: orderItems }, email: emailResult });
  }),
);

export default router;
