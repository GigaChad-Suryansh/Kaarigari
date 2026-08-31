import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const products = [
  { id: 1, name: 'Indigo Bloom Handblock Dupatta', category: 'Textiles', origin: 'Jaipur, Rajasthan', price: 1890, artisan: 'Meera Devi', rating: 4.9 },
  { id: 2, name: 'Terracotta Matka Set', category: 'Pottery', origin: 'Khurja, Uttar Pradesh', price: 1450, artisan: 'Ramesh Kumar', rating: 4.8 },
  { id: 3, name: 'Sunset Cane Basket', category: 'Baskets', origin: 'Assam', price: 980, artisan: 'Bina Bora', rating: 4.7 },
  { id: 4, name: 'Kutch Mirrorwork Cushion', category: 'Textiles', origin: 'Bhuj, Gujarat', price: 1240, artisan: 'Sakina Khatri', rating: 4.9 }
];

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'kaarigari-backend' }));

app.post('/api/auth/send-otp', (req, res) => {
  const phone = String(req.body?.phone || '').replace(/\D/g, '');
  if (phone.length !== 10) return res.status(400).json({ error: 'Enter a valid 10-digit mobile number' });
  res.json({ ok: true, message: 'OTP sent', demoOtp: '123456' });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp, role } = req.body || {};
  if (!/^\d{10}$/.test(String(phone || '')) || String(otp) !== '123456') return res.status(401).json({ error: 'Invalid OTP' });
  res.json({ ok: true, token: `demo-${role || 'customer'}-${Date.now()}`, role: role || 'customer' });
});

app.get('/api/products', (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const category = String(req.query.category || 'all').toLowerCase();
  const result = products.filter(p => (category === 'all' || p.category.toLowerCase() === category) && (!q || JSON.stringify(p).toLowerCase().includes(q)));
  res.json({ products: result, count: result.length });
});

app.post('/api/ai/classify', (req, res) => {
  const text = String(req.body?.text || '').trim();
  if (!text) return res.status(400).json({ error: 'Product description is required' });
  const lower = text.toLowerCase();
  let category = 'Handicrafts';
  if (/pot|matka|ceramic|clay|terracotta/.test(lower)) category = 'Pottery';
  else if (/dupatta|saree|cloth|textile|embroid|weave/.test(lower)) category = 'Textiles';
  else if (/basket|bamboo|cane|wicker/.test(lower)) category = 'Baskets';
  else if (/necklace|earring|jewel|bead/.test(lower)) category = 'Jewellery';
  res.json({ name: text.split(/[,.]/)[0].slice(0, 70) || 'Handmade Craft', category, keywords: text.split(/\s+/).filter(Boolean).slice(0, 8), confidence: 0.88 });
});

app.post('/api/ai/description', (req, res) => {
  const { name = 'Handmade craft', category = 'Handicrafts', origin = 'India', material = 'traditional materials' } = req.body || {};
  res.json({ description: `${name} is a handcrafted ${category.toLowerCase()} piece made using ${material}. Rooted in the traditions of ${origin}, each piece carries the character of the maker and the craft community behind it. Small variations are part of its handmade identity.`, culturalStory: `Crafts from ${origin} connect everyday objects with local skills, materials and stories passed between generations. This listing helps the maker share that heritage directly with customers.`, seoKeywords: [name, category, origin, 'handmade', 'artisan', 'Indian craft'] });
});

app.post('/api/ai/business-insights', (req, res) => {
  const sales = Number(req.body?.sales || 42800);
  res.json({ revenue: sales, orders: Number(req.body?.orders || 28), products: Number(req.body?.products || 12), insights: ['Your textile products are attracting the strongest interest.', 'Add clear origin stories to improve product trust.', 'Keep 2–3 ready-to-ship bestsellers in stock.'], nextAction: 'Create a new voice-first listing for your best craft.' });
});

app.post('/api/products/enhance-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Image is required' });
  res.json({ ok: true, enhancement: { background: 'cleaned', exposure: 'balanced', contrast: 'improved', crop: 'marketplace-ready' }, note: 'Connect a production image model here for pixel-level enhancement.' });
});

app.listen(process.env.PORT || 8000, () => console.log(`Kaarigari API running on http://localhost:${process.env.PORT || 8000}`));
