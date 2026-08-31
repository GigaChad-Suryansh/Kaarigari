# Kaarigari Backend

Express API foundation for Kaarigari.

## Run

```bash
cd backend
npm install
npm start
```

Server defaults to `http://localhost:8000`.

## API

- `GET /api/health`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `GET /api/products?q=&category=`
- `POST /api/ai/classify`
- `POST /api/ai/description`
- `POST /api/ai/business-insights`
- `POST /api/products/enhance-image` (multipart form field: `image`)

Demo authentication uses OTP `123456`. Replace it with a real SMS provider before deployment.
