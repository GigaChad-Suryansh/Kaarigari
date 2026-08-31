-- Kaarigari production data model
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer','artisan')),
  name TEXT,
  language TEXT DEFAULT 'hi-IN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  artisan_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  cultural_story TEXT,
  origin TEXT,
  material TEXT,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  enhanced_image_url TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES users(id),
  status TEXT DEFAULT 'placed',
  total INTEGER NOT NULL,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL
);

CREATE TABLE otp_sessions (
  phone TEXT PRIMARY KEY,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  attempts INTEGER DEFAULT 0
);
