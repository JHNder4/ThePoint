-- ============================================================
-- THEPOINT — Supabase Schema (versión final)
-- Ejecuta este archivo completo en el SQL Editor de Supabase
-- ============================================================

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id             TEXT PRIMARY KEY,
  created_at     BIGINT NOT NULL,
  items          JSONB NOT NULL DEFAULT '[]',
  total          NUMERIC(10, 2) NOT NULL,
  address        TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','preparing','on-the-way','delivered','cancelled')),
  estimated_time TEXT
);

-- Tabla de productos (sobreescrituras del admin)
CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  image       TEXT NOT NULL DEFAULT '',
  available   BOOLEAN NOT NULL DEFAULT TRUE,
  is_category BOOLEAN NOT NULL DEFAULT FALSE
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders (status);

-- ============================================================
-- Productos por defecto
-- ============================================================
INSERT INTO products (id, name, price, image, available, is_category) VALUES
  ('soda',            'Soda',        140, '/images/09fed79a-41e2-4c6a-b19a-c78b93d7c0e6.jpg', TRUE,  FALSE),
  ('soda-lavada',     'Soda Lavada', 500, '/images/OIP.jpg',                                   TRUE,  FALSE),
  ('verde',           'Verde',       140, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', TRUE, FALSE),
  ('frio',            'Frío',        140, '/images/0eaf463f-8af7-4b29-bbe2-b4553197254c.jpg',  TRUE,  FALSE),
  ('cat-prerolls',    'Pre-rolls',     0, '',                                                   TRUE,  TRUE),
  ('cat-comestibles', 'Comestibles',   0, '',                                                   TRUE,  TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Clientes pueden crear e leer pedidos
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "orders_select" ON orders FOR SELECT USING (TRUE);
CREATE POLICY "orders_update" ON orders FOR UPDATE USING (TRUE);

-- Admin puede leer y actualizar productos
CREATE POLICY "products_select" ON products FOR SELECT USING (TRUE);
CREATE POLICY "products_update" ON products FOR UPDATE USING (TRUE);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (TRUE);
