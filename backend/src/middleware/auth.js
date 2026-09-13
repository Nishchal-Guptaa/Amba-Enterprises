import { getSupabaseAdmin } from '../lib/supabase.js';

export async function requireAuth(req, res, next) {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : null;

  if (!token) {
    return res.status(401).json({ error: 'A Bearer token is required.' });
  }

  try {
    const { data, error } = await getSupabaseAdmin().auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'The access token is invalid or expired.' });
    }
    req.accessToken = token;
    req.user = data.user;
    return next();
  } catch (error) {
    return next(error);
  }
}
