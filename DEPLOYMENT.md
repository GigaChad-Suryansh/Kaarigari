# Kaarigari deployment checklist

## Current status
The repository is deployable as a demo/MVP. The backend can run on port 8000 and has a Dockerfile. CI checks JavaScript syntax on pushes and pull requests.

## Before public production launch
1. Configure a real SMS OTP provider and remove the demo OTP.
2. Configure a real database using `DATABASE_URL` and run `backend/schema.sql`.
3. Replace demo AI classification/description logic with the selected AI provider; keep keys server-side.
4. Connect an image enhancement model/storage pipeline.
5. Add real payment processing and order persistence.
6. Set `CORS_ORIGIN` to the deployed frontend origin.
7. Set a strong `JWT_SECRET` and implement signed, expiring sessions.
8. Configure object storage for original/enhanced images.
9. Add rate limiting, validation, logging, and HTTPS.
10. Run end-to-end tests against staging before production.

## Demo deployment
Backend:

```bash
cd backend
npm install
npm start
```

Then open the frontend against the deployed API URL.

Docker:

```bash
docker compose up --build
```

## Important
Do not commit `.env` files, API keys, SMS credentials, payment secrets, or database passwords.
