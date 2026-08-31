const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;
const products = [
  {id:'p1',name:'Indigo Bloom Handblock Dupatta',category:'Textiles',origin:'Jaipur, Rajasthan',price:1890,artisan:'Meera Devi'},
  {id:'p2',name:'Terracotta Matka Set',category:'Pottery',origin:'Khurja, Uttar Pradesh',price:1450,artisan:'Ramesh Kumar'},
  {id:'p3',name:'Sunset Cane Basket',category:'Baskets',origin:'Assam',price:980,artisan:'Bina Bora'},
  {id:'p4',name:'Kutch Mirrorwork Cushion',category:'Textiles',origin:'Bhuj, Gujarat',price:1240,artisan:'Sakina Khatri'}
];
const otps = new Map();
const json = (res, status, body) => { res.writeHead(status, {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'}); res.end(JSON.stringify(body)); };
const body = req => new Promise((resolve,reject)=>{let d='';req.on('data',c=>d+=c);req.on('end',()=>{try{resolve(d?JSON.parse(d):{})}catch(e){reject(e)}})});

const server = http.createServer(async (req,res)=>{
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'});return res.end();}
  const url = new URL(req.url, `http://${req.headers.host}`);
  if(url.pathname==='/api/health') return json(res,200,{ok:true,service:'Kaarigari API'});
  if(url.pathname==='/api/products' && req.method==='GET') return json(res,200,{products});
  if(url.pathname==='/api/auth/send-otp' && req.method==='POST'){
    const b=await body(req); if(!/^\d{10}$/.test(String(b.phone||''))) return json(res,400,{error:'Invalid phone number'});
    otps.set(b.phone,'123456'); return json(res,200,{ok:true,message:'OTP sent',demoOtp:'123456'});
  }
  if(url.pathname==='/api/auth/verify-otp' && req.method==='POST'){
    const b=await body(req); const valid=otps.get(b.phone)==b.otp || b.otp==='123456';
    if(!valid)return json(res,401,{error:'Invalid OTP'});
    return json(res,200,{ok:true,token:crypto.randomUUID(),role:b.role||'customer'});
  }
  if(url.pathname==='/api/ai/classify' && req.method==='POST'){
    const b=await body(req); const text=String(b.text||'').toLowerCase();
    let category='Other',name='Handmade Craft';
    if(/pot|matka|terracotta|clay/.test(text)){category='Pottery';name='Handcrafted Terracotta Pottery';}
    else if(/basket|bamboo|cane|weav/.test(text)){category='Baskets';name='Handwoven Basket';}
    else if(/dupatta|sari|textile|cloth|fabric|block/.test(text)){category='Textiles';name='Handcrafted Textile';}
    else if(/jewel|necklace|earring|silver/.test(text)){category='Jewellery';name='Handcrafted Jewellery';}
    return json(res,200,{name,category,keywords:text.split(/\s+/).filter(Boolean).slice(0,8),confidence:0.86});
  }
  if(url.pathname==='/api/ai/description' && req.method==='POST'){
    const b=await body(req); const n=b.name||'this handmade craft', origin=b.origin||'its artisan community';
    return json(res,200,{description:`Discover ${n}, thoughtfully made by hand in ${origin}. Each piece carries the marks of its maker, traditional techniques, and a story rooted in local craft heritage. Made in small batches, it brings an authentic handmade character to everyday life.`});
  }
  if(url.pathname==='/api/business/insights' && req.method==='GET') return json(res,200,{revenue:42800,orders:28,products:12,insights:['Textiles are your strongest category','Weekend sales are trending upward','Add origin stories to improve product discovery']});

  const file = url.pathname==='/' ? '/index.html' : url.pathname;
  const safe = path.normalize(file).replace(/^([.][.][/\\])+/, '');
  const target = path.join(ROOT,safe);
  if(!target.startsWith(ROOT) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) return json(res,404,{error:'Not found'});
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json'};
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});fs.createReadStream(target).pipe(res);
});
server.listen(PORT,()=>console.log(`Kaarigari running at http://localhost:${PORT}`));
