import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8000';
const health = await fetch(`${base}/api/health`);
assert.equal(health.status, 200);
assert.equal((await health.json()).ok, true);

const products = await fetch(`${base}/api/products?category=Textiles`);
assert.equal(products.status, 200);
const productData = await products.json();
assert.ok(Array.isArray(productData.products));

const classify = await fetch(`${base}/api/ai/classify`, {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:'Hand embroidered cotton dupatta from Jaipur'})});
assert.equal(classify.status, 200);
assert.equal((await classify.json()).category, 'Textiles');

console.log('Kaarigari smoke tests passed');
