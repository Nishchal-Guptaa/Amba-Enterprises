import { Router } from 'express';
import { config } from '../config.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { getSupabaseAdmin, getSupabasePublic } from '../lib/supabase.js';
import {
  isEmailConfigured,
  sendConfirmationEmail,
  sendPasswordResetEmail,
} from '../services/emailService.js';

const router = Router();

function requiredString(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    const error = new Error(`${field} is required.`);
    error.statusCode = 400;
    error.expose = true;
    throw error;
  }
  return value.trim();
}

function password(value) {
  const result = requiredString(value, 'password');
  if (result.length < 6) {
    const error = new Error('Password must be at least 6 characters.');
    error.statusCode = 400;
    error.expose = true;
    throw error;
  }
  return result;
}

router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const email = requiredString(req.body.email, 'email').toLowerCase();
    const newPassword = password(req.body.password);
    const fullName = requiredString(req.body.fullName || req.body.full_name, 'fullName');
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : null;
    const admin = getSupabaseAdmin();
    const userOptions = {
      email,
      password: newPassword,
      user_metadata: { full_name: fullName, phone },
    };
    const { data, error } =
      isEmailConfigured() && !config.supabaseAutoConfirm
        ? await admin.auth.admin.generateLink({
            type: 'signup',
            ...userOptions,
            options: { redirectTo: config.frontendUrl },
          })
        : await admin.auth.admin.createUser({
            ...userOptions,
            email_confirm: config.supabaseAutoConfirm,
          });
    if (error) throw error;

    const { error: profileError } = await admin.from('profiles').upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      phone,
      role: 'customer',
      status: 'active',
    });
    if (profileError) console.warn('[API] profile creation notice:', profileError.message);

    if (isEmailConfigured() && !config.supabaseAutoConfirm) {
      await sendConfirmationEmail({
        to: email,
        actionLink: data.properties.action_link,
      });
    }

    res.status(201).json({ user: data.user, session: null });
  }),
);

router.post(
  '/signin',
  asyncHandler(async (req, res) => {
    const email = requiredString(req.body.email, 'email').toLowerCase();
    const newPassword = password(req.body.password);
    const { data, error } = await getSupabasePublic().auth.signInWithPassword({
      email,
      password: newPassword,
    });
    if (error) {
      error.statusCode = 401;
      error.expose = true;
      throw error;
    }
    res.json(data);
  }),
);

router.post(
  '/signout',
  requireAuth,
  asyncHandler(async (req, res) => {
    // Revocation is best-effort; the client must also discard its access token.
    const { error } = await getSupabaseAdmin().auth.admin.signOut(req.accessToken);
    if (error) throw error;
    res.json({ success: true });
  }),
);

router.post(
  ['/forgot-password', '/forgot'],
  asyncHandler(async (req, res) => {
    const email = requiredString(req.body.email, 'email').toLowerCase();
    const redirectTo = req.body.redirectTo || config.passwordResetRedirectUrl;

    if (isEmailConfigured()) {
      const { data, error } = await getSupabaseAdmin().auth.admin.generateLink({
        type: 'recovery',
        email,
        options: { redirectTo },
      });
      if (error) throw error;
      await sendPasswordResetEmail({ to: email, actionLink: data.properties.action_link });
    } else {
      // Preserve Supabase's managed email behavior when SMTP is not configured.
      const { error } = await getSupabasePublic().auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
    }
    // Do not reveal whether an account exists.
    res.json({ success: true, message: 'If the account exists, a reset email has been sent.' });
  }),
);

router.post(
  ['/reset-password', '/reset'],
  asyncHandler(async (req, res) => {
    const tokenHash = requiredString(req.body.tokenHash || req.body.token_hash, 'tokenHash');
    const newPassword = password(req.body.newPassword || req.body.password);
    const client = getSupabasePublic();
    const { data, error } = await client.auth.verifyOtp({
      type: 'recovery',
      token_hash: tokenHash,
    });
    if (error) throw error;
    const { data: updated, error: updateError } = await client.auth.updateUser({
      password: newPassword,
    });
    if (updateError) throw updateError;
    await client.auth.signOut();
    res.json({ user: updated.user, session: data.session || null });
  }),
);

router.post(
  ['/update-password', '/update'],
  requireAuth,
  asyncHandler(async (req, res) => {
    const newPassword = password(req.body.newPassword || req.body.password);
    const { data, error } = await getSupabaseAdmin().auth.admin.updateUserById(
      req.user.id,
      { password: newPassword },
    );
    if (error) throw error;
    res.json({ user: data.user });
  }),
);

export default router;
