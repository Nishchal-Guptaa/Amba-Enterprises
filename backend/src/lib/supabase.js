import { createClient } from '@supabase/supabase-js';
import { config, requireConfig } from '../config.js';

let adminClient;
let publicClient;

export function getSupabaseAdmin() {
  requireConfig('supabaseUrl', 'supabaseServiceRoleKey');
  if (!adminClient) {
    adminClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
  return adminClient;
}

export function getSupabasePublic() {
  requireConfig('supabaseUrl', 'supabaseAnonKey');
  if (!publicClient) {
    publicClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
  return publicClient;
}

export function getSupabaseUser(accessToken) {
  requireConfig('supabaseUrl', 'supabaseAnonKey');
  if (!accessToken) {
    const error = new Error('An access token is required.');
    error.statusCode = 401;
    error.expose = true;
    throw error;
  }

  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
