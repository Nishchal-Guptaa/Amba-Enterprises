import { Router } from 'express';
import { asyncHandler } from '../middleware/errors.js';
import { getSupabasePublic } from '../lib/supabase.js';

const router = Router();

router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const { data, error } = await getSupabasePublic()
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    res.json({ categories: data || [] });
  }),
);

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const client = getSupabasePublic();
    const { data: products, error } = await client
      .from('products')
      .select('*, product_categories(name)')
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    const rows = products || [];
    if (!rows.length) return res.json({ products: [] });

    const ids = rows.map((product) => product.id);
    const [{ data: images }, { data: prices }] = await Promise.all([
      client.from('product_images').select('product_id, image_path').in('product_id', ids),
      client
        .from('product_prices')
        .select('*')
        .lte('effective_from', new Date().toISOString())
        .or(`effective_to.is.null,effective_to.gt.${new Date().toISOString()}`)
        .order('effective_from', { ascending: false }),
    ]);
    const imageMap = {};
    (images || []).forEach((image) => {
      if (!imageMap[image.product_id]) imageMap[image.product_id] = image.image_path;
    });
    const priceMap = {};
    (prices || []).forEach((price) => {
      if (!priceMap[price.product_id]) priceMap[price.product_id] = price;
    });

    const result = rows.map((product) => {
      const imagePath = imageMap[product.id] || (product.sku ? `product-images/${product.sku}.jpg` : null);
      const imageUrl = imagePath
        ? client.storage.from('product-images').getPublicUrl(imagePath.replace(/^product-images\//, '')).data.publicUrl
        : null;
      return {
        ...product,
        currentPrice: priceMap[product.id]?.price ?? null,
        currency: priceMap[product.id]?.currency ?? 'INR',
        categoryName: product.product_categories?.name || 'Uncategorized',
        imageUrl,
      };
    });
    res.json({ products: result });
  }),
);

export default router;
