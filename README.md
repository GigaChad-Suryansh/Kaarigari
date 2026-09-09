# Kaarigari

**Made with a voice. Built for every artisan.**

Kaarigari is an artisan-first marketplace concept with separate customer and artisan experiences. The demo combines a customer marketplace with a voice-first artisan business manager.

## Included in the MVP

- Customer marketplace with search and craft categories
- Role-based phone + OTP authentication through the backend
- Artisan dashboard with products, orders and revenue insights
- Browser voice input for Hindi and other supported Indian languages
- AI classification and listing-description/story generation when `OPENAI_API_KEY` is configured
- Local fallback classification and copy generation when AI credentials are unavailable
- Product photo validation, preview and optional Cloudinary upload/transformation
- Wishlist, product, order and draft-sync API endpoints
- Offline-first draft persistence in the browser
- Optional Razorpay order creation endpoint
- Responsive marketplace and artisan dashboard

## Local demo

1. Start the backend:

```bash
cd backend
npm install
copy .env.example .env
npm start
```

2. Serve the repository root from another terminal:

```bash
python -m http.server 5500
```

3. Open `http://localhost:5500`.

4. For SMS login, fill the Twilio values in `backend/.env` and use a recipient number verified by the Twilio trial account. The prototype's current demo verification mode accepts any 6-digit code after a successful SMS send; this is intentionally not production authentication.

## Optional integrations

- **OpenAI:** set `OPENAI_API_KEY` to enable generated classification, descriptions, cultural stories and keywords.
- **Cloudinary:** set the three Cloudinary credentials to enable hosted image transformation/upload.
- **Razorpay:** set the Razorpay key ID and secret to enable payment-order creation.
- **PostgreSQL:** `DATABASE_URL` is reserved for the production persistence layer; the current demo keeps its small runtime dataset in memory.

Never commit `.env` or API keys to GitHub.
