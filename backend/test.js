import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8000';
const health = await fetch(`${base}/api/health`);
assert.equal(health.status, 200);
assert.equal((await health.json()).ok, true);

const products = await fetch(`${base}/api/products?category=Textiles`);
assert.equal(products.status, 200);
const productData = await products.json();
assert.ok(Array.isArray(productData.products));
assert.ok(productData.products.length >= 1);

const detail = await fetch(`${base}/api/products/1`);
assert.equal(detail.status, 200);
assert.equal((await detail.json()).product.id, 1);

const classify = await fetch(`${base}/api/ai/classify`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: 'Hand embroidered cotton dupatta from Jaipur' }) });
assert.equal(classify.status, 200);
assert.equal((await classify.json()).category, 'Textiles');

const draft = await fetch(`${base}/api/products`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Demo craft', category: 'Textiles', price: 900, origin: 'Jaipur', material: 'cotton', technique: 'hand embroidery', status: 'draft' }) });
assert.equal(draft.status, 200);
const draftData = await draft.json();
assert.equal(draftData.product.name, 'Demo craft');

const sync = await fetch(`${base}/api/sync/products`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ products: [{ clientId: 'smoke-test', name: 'Demo craft' }] }) });
assert.equal(sync.status, 200);
assert.equal((await sync.json()).ok, true);

const wishlist = await fetch(`${base}/api/wishlist`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ customerId: 'smoke-test', productId: 1 }) });
assert.equal(wishlist.status, 200);
assert.ok((await wishlist.json()).productIds.includes(1));

console.log('Kaarigari smoke tests passed');
