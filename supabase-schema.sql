-- ============================================================
-- THEPOINT — Supabase Schema completo
-- Ejecuta en el SQL Editor de Supabase
-- ============================================================

-- ─── Tabla de órdenes ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id             TEXT PRIMARY KEY,
  created_at     BIGINT NOT NULL,
  items          JSONB NOT NULL DEFAULT '[]',
  total          NUMERIC(10, 2) NOT NULL,
  address        TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'nuevo',
  estimated_time TEXT
);

-- ─── Tabla de productos ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  price        NUMERIC(10, 2) NOT NULL DEFAULT 0,
  promo_price  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_promo     BOOLEAN NOT NULL DEFAULT FALSE,
  image        TEXT NOT NULL DEFAULT '',
  available    BOOLEAN NOT NULL DEFAULT TRUE,
  is_category  BOOLEAN NOT NULL DEFAULT FALSE,
  category_key TEXT
);

-- ─── Tabla de configuración del banner ───────────────────────
CREATE TABLE IF NOT EXISTS banner_settings (
  id          INTEGER PRIMARY KEY DEFAULT 1,
  badge_text  TEXT NOT NULL DEFAULT 'Entrega Premium',
  title       TEXT NOT NULL DEFAULT '',
  subtitle    TEXT NOT NULL DEFAULT '',
  button_text TEXT NOT NULL DEFAULT 'Hacer pedido',
  button_link TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  is_active   BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Migraciones (si las tablas ya existen) ──────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS promo_price  NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_promo     BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_key TEXT;

-- Actualizar constraint de status para nuevos estados
DO $$
BEGIN
  ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
  ALTER TABLE orders ADD CONSTRAINT orders_status_check
    CHECK (status IN (
      'nuevo','confirmado','preparando','en-camino','entregado','cancelado',
      'pending','preparing','on-the-way','delivered','cancelled'
    ));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ─── Índices ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders (status);
CREATE INDEX IF NOT EXISTS idx_products_is_promo ON products (is_promo);

-- ─── Datos por defecto: banner ───────────────────────────────
INSERT INTO banner_settings (id, badge_text, title, subtitle, button_text, button_link, image_url, is_active)
VALUES (1, 'Entrega Premium', '', '', 'Hacer pedido', '', '', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ─── Datos por defecto: productos ────────────────────────────
INSERT INTO products (id, name, price, promo_price, is_promo, image, available, is_category, category_key) VALUES
  ('soda',        'Soda',        140, 0, FALSE, '/images/09fed79a-41e2-4c6a-b19a-c78b93d7c0e6.jpg', TRUE,  FALSE, NULL),
  ('soda-lavada', 'Soda Lavada', 500, 0, FALSE, '/images/OIP.jpg',                                   TRUE,  FALSE, NULL),
  ('verde',       'Verde',       140, 0, FALSE, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', TRUE, FALSE, NULL),
  ('frio',        'Frío',        140, 0, FALSE, '/images/0eaf463f-8af7-4b29-bbe2-b4553197254c.jpg',  TRUE,  FALSE, NULL),
  ('cat-prerolls',    'Pre-rolls',   0, 0, FALSE, '', TRUE, TRUE,  'prerolls'),
  ('cat-comestibles', 'Comestibles', 0, 0, FALSE, '', TRUE, TRUE,  'comestibles'),
  ('preroll-uva',              'Blunt Wrap XXL Uva',               80,  0,   FALSE, '', TRUE, FALSE, 'prerolls'),
  ('preroll-blueberry',        'Blunt Wrap XXL Blueberry',         80,  0,   FALSE, '', TRUE, FALSE, 'prerolls'),
  ('preroll-chocolate',        'Blunt Wrap XXL Chocolate Amargo',  90,  0,   FALSE, '', TRUE, FALSE, 'prerolls'),
  ('preroll-mango',            'Blunt Wrap XXL Mango',             85,  0,   FALSE, '', TRUE, FALSE, 'prerolls'),
  ('comestible-brownie',       'Brownies de chocolate',            80,  0,   FALSE, '', TRUE, FALSE, 'comestibles'),
  ('comestible-galletas',      'Galletas con chispas de chocolate',80,  0,   FALSE, '', TRUE, FALSE, 'comestibles'),
  ('promo-prerolls-2x150',     'Promo Pre-rolls 2x150',           150, 150,  TRUE,  '', TRUE, FALSE, 'prerolls'),
  ('promo-prerolls-3x220',     'Promo Pre-rolls 3x220',           220, 220,  TRUE,  '', TRUE, FALSE, 'prerolls'),
  ('promo-comestibles-2x150',  'Promo Comestibles 2x150',         150, 150,  TRUE,  '', TRUE, FALSE, 'comestibles'),
  ('promo-comestibles-3x220',  'Promo Comestibles 3x220',         220, 220,  TRUE,  '', TRUE, FALSE, 'comestibles')
ON CONFLICT (id) DO NOTHING;

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "orders_insert"  ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY IF NOT EXISTS "orders_select"  ON orders FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "orders_update"  ON orders FOR UPDATE USING (TRUE);

CREATE POLICY IF NOT EXISTS "products_select" ON products FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "products_update" ON products FOR UPDATE USING (TRUE);
CREATE POLICY IF NOT EXISTS "products_insert" ON products FOR INSERT WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "banner_select"  ON banner_settings FOR SELECT USING (TRUE);
CREATE POLICY IF NOT EXISTS "banner_update"  ON banner_settings FOR UPDATE USING (TRUE);
CREATE POLICY IF NOT EXISTS "banner_insert"  ON banner_settings FOR INSERT WITH CHECK (TRUE);

-- ─── Realtime (pedidos en tiempo real) ───────────────────────
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
