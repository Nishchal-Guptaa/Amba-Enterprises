# Amba API

This Express API keeps the Supabase service-role key on the server. The
frontend bridge sends only the logged-in user's access token.

## Setup

1. Copy the root `.env.example` to `.env` and fill in the values.
2. Run `npm install` from the repository root.
3. Start the API with `npm run backend` or `npm run backend:dev`.
4. Start Vite separately with `npm run dev`.

Never put `SUPABASE_SERVICE_ROLE_KEY` in a `VITE_*` variable or send it to a
browser. The frontend Supabase anon key is public by design; database access
must be protected with Supabase Row Level Security.

## API

Protected endpoints require an `Authorization: Bearer <access-token>` header.

- `POST /api/auth/signup`, `/signin`, `/signout`
- `POST /api/auth/forgot-password`, `/reset-password`, `/update-password`
- `GET|PUT /api/profile`
- `GET /api/products`, `GET /api/products/categories`
- `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders`
- `GET /health`

The order endpoint recalculates current prices on the server. Payment
processing is intentionally not included. SMTP is optional: when configured,
the API can send custom password-reset and order-confirmation emails; without
SMTP, password reset uses Supabase's managed email provider.
