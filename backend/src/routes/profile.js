import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { getSupabaseAdmin } from '../lib/supabase.js';

const router = Router();
router.use(requireAuth);

async function getOrCreateProfile(user) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  if (data) return data;
  const fallback = {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    phone: user.user_metadata?.phone || null,
    role: 'customer',
    status: 'active',
  };
  const { data: created, error: createError } = await admin
    .from('profiles')
    .upsert(fallback)
    .select()
    .single();
  if (createError) throw createError;
  return created;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json({ profile: await getOrCreateProfile(req.user) });
  }),
);

router.put(
  '/',
  asyncHandler(async (req, res) => {
    const update = {};
    if (typeof req.body.full_name === 'string') update.full_name = req.body.full_name.trim();
    if (typeof req.body.phone === 'string') update.phone = req.body.phone.trim() || null;
    if (!Object.keys(update).length) {
      return res.status(400).json({ error: 'No profile fields were provided.' });
    }
    const { data, error } = await getSupabaseAdmin()
      .from('profiles')
      .update(update)
      .eq('id', req.user.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ profile: data });
  }),
);

export default router;

