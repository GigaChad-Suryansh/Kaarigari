import express from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'crypto';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const products = [
  { id: 1, name: 'Indigo Bloom Handblock Dupatta', category: 'Textiles', origin: 'Jaipur, Rajasthan', price: 1890, artisan: 'Meera Devi', rating: 4.9, stock: 8 },
  { id: 2, name: 'Terracotta Matka Set', category: 'Pottery', origin: 'Khurja, Uttar Pradesh', price: 1450, artisan: 'Ramesh Kumar', rating: 4.8, stock: 12 },
  { id: 3, name: 'Sunset Cane Basket', category: 'Baskets', origin: 'Assam', price: 980, artisan: 'Bina Bora', rating: 4.7, stock: 16 },
  { id: 4, name: 'Kutch Mirrorwork Cushion', category: 'Textiles', origin: 'Bhuj, Gujarat', price: 1240, artisan: 'Sakina Khatri', rating: 4.9, stock: 5 }
];
const otps = new Map();
const orders = [];
const syncQueue = [];
const json = (res, body, status=200) => res.status(status).json(body);

app.get('/api/health', (_req, res) => json(res, { ok: true, service: 'kaarigari-backend' }));

app.post('/api/auth/send-otp', (req, res) => {
  const phone = String(req.body?.phone || '').replace(/\D/g, '');
  if (phone.length !== 10) return json(res, { error: 'Enter a valid 10-digit mobile number' }, 400);
  otps.set(phone, { code: '123456', expires: Date.now() + 5 * 60_000 });
  json(res, { ok: true, message: 'OTP sent', demoOtp: '123456' });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp, role } = req.body || {};
  const record = otps.get(String(phone));
  const valid = record && record.expires > Date.now() && String(otp) === record.code;
  if (!/^\d{10}$/.test(String(phone || '')) || !valid) return json(res, { error: 'Invalid or expired OTP' }, 401);
  otps.delete(String(phone));
  json(res, { ok: true, token: `demo-${crypto.randomUUID()}`, role: role || 'customer' });
});

app.get('/api/products', (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const category = String(req.query.category || 'all').toLowerCase();
  const result = products.filter(p => (category === 'all' || p.category.toLowerCase() === category) && (!q || JSON.stringify(p).toLowerCase().includes(q)));
  json(res, { products: result, count: result.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => String(p.id) === req.params.id);
  if (!product) return json(res, { error: 'Product not found' }, 404);
  json(res, { product, story: `Meet ${product.artisan}, a maker from ${product.origin}. This craft carries local techniques and a story that deserves to travel beyond its community.` });
});

app.post('/api/orders', (req, res) => {
  const { customerId='demo-customer', items=[], shippingAddress='' } = req.body || {};
  if (!items.length || !shippingAddress.trim()) return json(res, { error: 'Items and shipping address are required' }, 400);
  const lineItems = items.map(i => {
    const p = products.find(x => String(x.id) === String(i.productId));
    return p ? { productId: p.id, name: p.name, quantity: Math.max(1, Number(i.quantity || 1)), unitPrice: p.price } : null;
  }).filter(Boolean);
  const total = lineItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const order = { id: crypto.randomUUID(), customerId, items: lineItems, total, shippingAddress, status: 'placed', createdAt: new Date().toISOString() };
  orders.push(order); json(res, { ok: true, order });
});

app.get('/api/orders', (req, res) => json(res, { orders: orders.filter(o => !req.query.customerId || o.customerId === req.query.customerId) }));

app.post('/api/sync/products', (req, res) => {
  const drafts = Array.isArray(req.body?.products) ? req.body.products : [];
  const synced = drafts.map(d => ({ clientId: d.clientId || crypto.randomUUID(), serverId: `draft-${crypto.randomUUID()}`, status: 'synced' }));
  syncQueue.push(...drafts.map(d => ({ ...d, status: 'synced', syncedAt: new Date().toISOString() })));
  json(res, { ok: true, synced });
});

app.post('/api/ai/classify', (req, res) => {
  const text = String(req.body?.text || '').trim();
  if (!text) return json(res, { error: 'Product description is required' }, 400);
  const lower = text.toLowerCase();
  let category = 'Handicrafts';
  if (/pot|matka|ceramic|clay|terracotta/.test(lower)) category = 'Pottery';
  else if (/dupatta|saree|cloth|textile|embroid|weave/.test(lower)) category = 'Textiles';
  else if (/basket|bamboo|cane|wicker/.test(lower)) category = 'Baskets';
  else if (/necklace|earring|jewel|bead/.test(lower)) category = 'Jewellery';
  json(res, { name: text.split(/[,.]/)[0].slice(0, 70) || 'Handmade Craft', category, keywords: text.split(/\s+/).filter(Boolean).slice(0, 8), confidence: 0.88 });
});

app.post('/api/ai/description', (req, res) => {
  const { name='Handmade craft', category='Handicrafts', origin='India', material='traditional materials' } = req.body || {};
  json(res, { description: `${name} is a handcrafted ${category.toLowerCase()} piece made using ${material}. Rooted in the traditions of ${origin}, each piece carries the character of the maker and the craft community behind it. Small variations are part of its handmade identity.`, culturalStory: `Crafts from ${origin} connect everyday objects with local skills, materials and stories passed between generations. This listing helps the maker share that heritage directly with customers.`, seoKeywords: [name, category, origin, 'handmade', 'artisan', 'Indian craft'] });
});

app.post('/api/ai/business-insights', (req, res) => {
  const sales = Number(req.body?.sales || 42800);
  json(res, { revenue: sales, orders: Number(req.body?.orders || 28), products: Number(req.body?.products || 12), insights: ['Your textile products are attracting the strongest interest.', 'Add clear origin stories to improve product trust.', 'Keep 2–3 ready-to-ship bestsellers in stock.'], nextAction: 'Create a new voice-first listing for your best craft.' });
});

app.post('/api/products/enhance-image', upload.single('image'), (req, res) => {
  if (!req.file) return json(res, { error: 'Image is required' }, 400);
  json(res, { ok: true, enhancement: { background: 'cleaned', exposure: 'balanced', contrast: 'improved', crop: 'marketplace-ready' }, note: 'Connect a production image model here for pixel-level enhancement.' });
});

app.listen(process.env.PORT || 8000, () => console.log(`Kaarigari API running on http://localhost:${process.env.PORT || 8000}`));
