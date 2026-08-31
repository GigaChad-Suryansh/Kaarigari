const KAARIGARI_API = window.KAARIGARI_API || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const response = await fetch(`${KAARIGARI_API}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Kaarigari API request failed');
  return data;
}

export const getProducts = ({ q = '', category = 'all' } = {}) => request(`/products?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`);
export const sendOtp = phone => request('/auth/send-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone}) });
export const verifyOtp = (phone, otp, role) => request('/auth/verify-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone, otp, role}) });
export const classifyProduct = text => request('/ai/classify', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text}) });
export const generateDescription = payload => request('/ai/description', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
export const businessInsights = (payload = {}) => request('/ai/business-insights', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
export const createOrder = payload => request('/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
export const getOrders = customerId => request(`/orders?customerId=${encodeURIComponent(customerId)}`);
export const syncDraft = payload => request('/sync', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
export const enhanceImage = file => { const form = new FormData(); form.append('image', file); return request('/products/enhance-image', {method:'POST', body:form}); };
