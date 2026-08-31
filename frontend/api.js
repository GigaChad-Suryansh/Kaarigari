const KAARIGARI_API = window.KAARIGARI_API || 'http://localhost:8000/api';

export async function getProducts({ q = '', category = 'all' } = {}) {
  const r = await fetch(`${KAARIGARI_API}/products?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`);
  if (!r.ok) throw new Error('Unable to load products');
  return r.json();
}

export async function sendOtp(phone) {
  const r = await fetch(`${KAARIGARI_API}/auth/send-otp`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ phone }) });
  return r.json();
}

export async function verifyOtp(phone, otp, role) {
  const r = await fetch(`${KAARIGARI_API}/auth/verify-otp`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ phone, otp, role }) });
  return r.json();
}

export async function classifyProduct(text) {
  const r = await fetch(`${KAARIGARI_API}/ai/classify`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ text }) });
  return r.json();
}

export async function generateDescription(payload) {
  const r = await fetch(`${KAARIGARI_API}/ai/description`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  return r.json();
}

export async function businessInsights(payload = {}) {
  const r = await fetch(`${KAARIGARI_API}/ai/business-insights`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  return r.json();
}
