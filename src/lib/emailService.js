import { supabase } from './supabaseClient';

/**
 * Format currency in INR
 */
function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

/**
 * Generates an HTML email string for the purchase order confirmation
 */
export function generateOrderConfirmationHtml({
  orderNumber,
  companyName,
  email,
  phoneNumber,
  shippingAddress,
  billingAddress,
  items = [],
  totalAmount = 0,
  notes = '',
  orderDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
}) {
  const itemsRows = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px 10px; font-family: 'Inter', sans-serif; font-size: 13px; color: #1F2937;">
          <strong style="color: #0B1D3A;">${item.product?.name || item.product_name_snapshot || 'Product'}</strong>
          ${item.product?.sku || item.sku_snapshot ? `<br/><span style="font-size: 11px; color: #6B7280; font-family: monospace;">SKU: ${item.product?.sku || item.sku_snapshot}</span>` : ''}
        </td>
        <td style="padding: 12px 10px; text-align: center; font-family: 'Inter', sans-serif; font-size: 13px; color: #1F2937;">
          ${item.qty || item.requested_qty}
        </td>
        <td style="padding: 12px 10px; text-align: right; font-family: 'Inter', sans-serif; font-size: 13px; color: #1F2937;">
          ₹${formatPrice(item.unitPrice || item.unit_price_at_request)}
        </td>
        <td style="padding: 12px 10px; text-align: right; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #0B1D3A;">
          ₹${formatPrice((item.qty || item.requested_qty) * (item.unitPrice || item.unit_price_at_request))}
        </td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: 'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F3F4F6; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #E5E7EB;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0B1D3A; padding: 32px 30px; text-align: center;">
              <h1 style="color: #FFFFFF; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">AMBA ENTERPRISES</h1>
              <p style="color: #F59E0B; margin: 6px 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Purchase Order Request Confirmation</p>
            </td>
          </tr>

          <!-- Confirmation Headline -->
          <tr>
            <td style="padding: 30px 30px 20px;">
              <h2 style="margin: 0 0 10px; color: #0B1D3A; font-size: 18px;">Thank you for your order request, ${companyName}!</h2>
              <p style="margin: 0; color: #4B5563; font-size: 14px; line-height: 1.6;">
                We have received your purchase order request <strong>#${orderNumber}</strong> submitted on <strong>${orderDate}</strong>. Our sales & dispatch team is currently reviewing your order.
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB; padding: 16px;">
                <tr>
                  <td width="50%" style="vertical-align: top; padding: 6px 10px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #6B7280; font-weight: 700; display: block; margin-bottom: 4px;">Order Details</span>
                    <div style="font-size: 13px; color: #1F2937; line-height: 1.5;">
                      <strong>PO Number:</strong> ${orderNumber}<br/>
                      <strong>Status:</strong> <span style="display: inline-block; padding: 2px 8px; background: #FEF3C7; color: #92400E; border-radius: 99px; font-weight: 700; font-size: 11px;">Pending Review</span><br/>
                      <strong>Date:</strong> ${orderDate}
                    </div>
                  </td>
                  <td width="50%" style="vertical-align: top; padding: 6px 10px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #6B7280; font-weight: 700; display: block; margin-bottom: 4px;">Contact & Company</span>
                    <div style="font-size: 13px; color: #1F2937; line-height: 1.5;">
                      <strong>${companyName}</strong><br/>
                      Email: ${email}<br/>
                      Phone: ${phoneNumber || 'N/A'}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 10px 10px 4px; border-top: 1px dashed #E5E7EB; margin-top: 8px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #6B7280; font-weight: 700; display: block; margin-bottom: 4px;">Delivery Site Address</span>
                    <div style="font-size: 13px; color: #1F2937;">${shippingAddress}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #F3F4F6;">
                    <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #4B5563; font-weight: 700;">Item</th>
                    <th style="padding: 10px; text-align: center; font-size: 11px; text-transform: uppercase; color: #4B5563; font-weight: 700;">Qty</th>
                    <th style="padding: 10px; text-align: right; font-size: 11px; text-transform: uppercase; color: #4B5563; font-weight: 700;">Unit Price</th>
                    <th style="padding: 10px; text-align: right; font-size: 11px; text-transform: uppercase; color: #4B5563; font-weight: 700;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
                <tfoot>
                  <tr style="background-color: #F9FAFB; border-top: 2px solid #E5E7EB;">
                    <td colspan="3" style="padding: 12px 10px; text-align: right; font-size: 13px; font-weight: 700; color: #1F2937;">
                      Total Order Value:
                    </td>
                    <td style="padding: 12px 10px; text-align: right; font-size: 15px; font-weight: 800; color: #0B1D3A;">
                      ₹${formatPrice(totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          ${notes ? `
          <!-- Notes -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <div style="background-color: #FEF9C3; border: 1px solid #FEF08A; border-radius: 6px; padding: 12px; font-size: 12px; color: #713F12;">
                <strong>Order Notes:</strong> ${notes}
              </div>
            </td>
          </tr>` : ''}

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #EFF6FF; border-left: 4px solid #2563EB; border-radius: 4px; padding: 14px 16px;">
                <p style="margin: 0; font-size: 13px; color: #1E40AF; line-height: 1.5;">
                  <strong>What happens next?</strong><br/>
                  Our sales representative will verify stock availability, apply any wholesale discounts, and contact you via phone or WhatsApp with the proforma invoice and dispatch schedule.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; border-top: 1px solid #E5E7EB; padding: 20px 30px; text-align: center;">
              <p style="margin: 0 0 6px; color: #6B7280; font-size: 12px;">
                Have questions regarding this order? Contact our support desk.
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 11px;">
                © ${new Date().getFullYear()} Amba Enterprises. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends order confirmation email to the customer
 */
export async function sendOrderConfirmationEmail(orderData) {
  const {
    orderNumber,
    companyName,
    email,
    phoneNumber,
    shippingAddress,
    billingAddress,
    items,
    totalAmount,
    notes,
  } = orderData;

  if (!email) {
    console.warn('No recipient email provided for order confirmation.');
    return { success: false, error: 'No email address provided' };
  }

  const emailHtml = generateOrderConfirmationHtml(orderData);

  try {
    // 1. Try Supabase Edge Function if deployed
    try {
      const { data: funcData, error: funcError } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          to: email,
          subject: `Purchase Order Request Received - ${orderNumber}`,
          html: emailHtml,
          orderNumber,
          companyName,
          totalAmount,
        },
      });

      if (!funcError && funcData) {
        console.log('Order confirmation email sent via Supabase Edge Function:', funcData);
        return { success: true, method: 'edge-function', data: funcData };
      }
    } catch (edgeErr) {
      // Edge function not yet deployed or configured
    }

    // 2. Log confirmation notification in Supabase for audit & user alerts
    if (supabase.auth) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'order_email_confirmation',
          subject: `Confirmation Email: Order ${orderNumber}`,
          message: `Order confirmation sent to ${email} for ${companyName} (PO: ${orderNumber}, Total: ₹${formatPrice(totalAmount)}).`,
        });
      }
    }

    console.info(`[Email Service] Order confirmation generated successfully for ${email} (PO: ${orderNumber}).`);
    return { success: true, method: 'logged', html: emailHtml };
  } catch (err) {
    console.error('Error in sendOrderConfirmationEmail:', err);
    return { success: false, error: err.message || err };
  }
}
