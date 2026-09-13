import { supabase } from './supabaseClient';

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  if (!apiUrl) {
    throw new Error('VITE_API_URL is not configured.');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || body.message || `API request failed (${response.status}).`);
  }
  return body;
}

export function isApiConfigured() {
  return Boolean(apiUrl);
}
