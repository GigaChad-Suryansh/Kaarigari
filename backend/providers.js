// Provider adapters keep the SIH demo fully runnable without third-party accounts.
// Set production credentials later and replace these adapters without changing routes.
export const providerStatus = () => ({
  mode: process.env.DEMO_MODE === 'false' ? 'production' : 'demo',
  otp: Boolean(process.env.TWILIO_VERIFY_SERVICE_SID),
  ai: Boolean(process.env.OPENAI_API_KEY),
  storage: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
  payments: Boolean(process.env.RAZORPAY_KEY_ID),
  database: Boolean(process.env.DATABASE_URL)
});

export async function sendOtp(phone) {
  return { sent: true, phone, demo: !process.env.TWILIO_VERIFY_SERVICE_SID };
}

export async function classify(text) {
  const lower = text.toLowerCase();
  const category = /pot|clay|ceramic|terracotta/.test(lower) ? 'Pottery'
    : /dupatta|saree|cloth|textile|embroid|weave/.test(lower) ? 'Textiles'
    : /basket|bamboo|cane|wicker/.test(lower) ? 'Baskets'
    : /necklace|earring|jewel|bead/.test(lower) ? 'Jewellery' : 'Handicrafts';
  return { category, keywords: text.split(/\s+/).filter(Boolean).slice(0, 10), provider: 'demo-fallback' };
}

export async function enhanceImage() {
  return { background: 'cleaned', exposure: 'balanced', contrast: 'improved', crop: 'marketplace-ready', provider: 'demo-fallback' };
}
