# Kaarigari API

The included `server.js` provides a dependency-free demo API for local development.

## Start

```bash
npm start
```

The app is served at `http://localhost:8000`.

## Endpoints

- `GET /api/health` — health check
- `GET /api/products` — marketplace products
- `POST /api/auth/send-otp` — accepts `{ "phone": "10 digits" }`; demo OTP is `123456`
- `POST /api/auth/verify-otp` — accepts `{ "phone": "...", "otp": "123456", "role": "customer|seller" }`
- `POST /api/ai/classify` — accepts `{ "text": "product description" }` and returns a category/name/keywords
- `POST /api/ai/description` — accepts `{ "name": "...", "origin": "..." }`
- `GET /api/business/insights` — returns demo artisan business insights

## Production integrations

Replace demo implementations with real services before deployment:

1. OTP: a server-side SMS provider, with rate limiting and verification expiry.
2. Speech: a multilingual STT provider or self-hosted model.
3. Classification/description: a server-side LLM endpoint; keep API keys out of the browser.
4. Image enhancement: an image-processing or vision service on the server.
5. Database: PostgreSQL/Supabase/Firebase/etc. for users, products, inventory, carts and orders.
6. Object storage: S3-compatible storage for product images.
7. Offline sync: persist an operation queue locally and reconcile server-side using stable IDs and timestamps.

The browser UI should treat the API as the source of truth once connectivity is available, while IndexedDB/local storage holds drafts and queued operations during outages.
