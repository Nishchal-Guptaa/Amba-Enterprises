import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));

// Load the root .env for local development, while allowing a backend/.env to
// override it when the API is deployed independently.
dotenv.config({ path: path.resolve(here, '../../.env') });
dotenv.config({ path: path.resolve(here, '../.env'), override: true });

const splitList = (value) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const config = {
  port: Number(process.env.PORT || 3001),
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  supabaseAnonKey:
    process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  corsOrigins: splitList(process.env.CORS_ORIGIN),
  passwordResetRedirectUrl:
    process.env.PASSWORD_RESET_REDIRECT_URL ||
    `${process.env.FRONTEND_URL || 'http://localhost:5173'}/update-password`,
  supabaseAutoConfirm: process.env.SUPABASE_AUTO_CONFIRM === 'true',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
    service: process.env.SMTP_SERVICE,
    from:
      process.env.SMTP_FROM ||
      (process.env.SMTP_USER ? `Amba Enterprises <${process.env.SMTP_USER}>` : null),
  },
};

export function requireConfig(...keys) {
  const missing = keys.filter((key) => !config[key]);
  if (missing.length) {
    const error = new Error(`Missing server configuration: ${missing.join(', ')}`);
    error.statusCode = 503;
    error.code = 'SERVER_NOT_CONFIGURED';
    throw error;
  }
}

