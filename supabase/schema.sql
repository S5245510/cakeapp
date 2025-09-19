-- Healthy Cake Shop Database Schema
-- This file contains the complete database schema for the cake shop

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_zh VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  description_zh TEXT,
  image_url VARCHAR(500),
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_zh VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  description_zh TEXT,
  short_description TEXT,
  short_description_zh TEXT,

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),

  -- Inventory
  sku VARCHAR(100) UNIQUE,
  track_quantity BOOLEAN DEFAULT false,
  quantity INTEGER DEFAULT 0,
  allow_backorders BOOLEAN DEFAULT false,

  -- Health Information
  ingredients TEXT[],
  ingredients_zh TEXT[],
  allergens TEXT[],
  allergens_zh TEXT[],
  nutritional_info JSONB,
  calories_per_serving INTEGER,
  serving_size VARCHAR(50),
  is_organic BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_sugar_free BOOLEAN DEFAULT false,

  -- Product Details
  weight_grams INTEGER,
  dimensions JSONB, -- {width, height, depth}
  serves_people INTEGER,
  preparation_time_hours INTEGER,
  shelf_life_days INTEGER,
  storage_instructions TEXT,
  storage_instructions_zh TEXT,

  -- SEO
  meta_title VARCHAR(255),
  meta_title_zh VARCHAR(255),
  meta_description TEXT,
  meta_description_zh TEXT,

  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  is_customizable BOOLEAN DEFAULT false,
  requires_advance_order BOOLEAN DEFAULT false,
  advance_order_days INTEGER DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Categories (many-to-many)
CREATE TABLE product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  alt_text_zh VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Variants (for size, flavor variations)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_zh VARCHAR(255),
  sku VARCHAR(100) UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  weight_grams INTEGER,
  serves_people INTEGER,
  quantity INTEGER DEFAULT 0,
  options JSONB, -- {size: "8 inch", flavor: "chocolate"}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom Cake Designs
CREATE TABLE cake_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  customer_phone VARCHAR(50),

  -- Design Details
  design_data JSONB NOT NULL, -- Complete 3D design configuration
  cake_type VARCHAR(100),
  size VARCHAR(50),
  serves_people INTEGER,

  -- Customization
  flavors TEXT[],
  colors TEXT[],
  decorations TEXT[],
  special_requests TEXT,
  special_requests_zh TEXT,

  -- Pricing
  base_price DECIMAL(10,2),
  customization_price DECIMAL(10,2),
  total_price DECIMAL(10,2),

  -- Delivery
  delivery_date DATE,
  delivery_time TIME,
  delivery_address TEXT,

  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  admin_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  date_of_birth DATE,

  -- Preferences
  preferred_language VARCHAR(5) DEFAULT 'en',
  dietary_restrictions TEXT[],
  marketing_consent BOOLEAN DEFAULT false,

  -- Address
  addresses JSONB, -- Array of address objects

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_email VARCHAR(255) NOT NULL,

  -- Guest customer info (when not registered)
  guest_info JSONB,

  -- Order totals
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,

  -- Delivery
  delivery_type VARCHAR(20) DEFAULT 'delivery' CHECK (delivery_type IN ('pickup', 'delivery')),
  delivery_date DATE,
  delivery_time TIME,
  delivery_address JSONB,
  delivery_instructions TEXT,

  -- Payment
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255),

  -- Order status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),

  -- Special instructions
  special_instructions TEXT,
  admin_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_variant_id UUID REFERENCES product_variants(id),
  cake_design_id UUID REFERENCES cake_designs(id),

  -- Item details (snapshot at time of order)
  product_name VARCHAR(255) NOT NULL,
  product_name_zh VARCHAR(255),
  sku VARCHAR(100),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,

  -- Customizations
  customizations JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons & Discounts
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_zh VARCHAR(255),
  description TEXT,
  description_zh TEXT,

  -- Discount details
  type VARCHAR(20) CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')),
  value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2),

  -- Usage limits
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  usage_limit_per_customer INTEGER DEFAULT 1,

  -- Validity
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Management (for non-tech users)
CREATE TABLE content_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_zh VARCHAR(255),
  content TEXT,
  content_zh TEXT,
  meta_title VARCHAR(255),
  meta_title_zh VARCHAR(255),
  meta_description TEXT,
  meta_description_zh TEXT,
  is_published BOOLEAN DEFAULT false,
  template VARCHAR(50) DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB,
  type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  group_name VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Suggestions Cache
CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  context_type VARCHAR(50) NOT NULL, -- 'cake_design', 'product_description', etc.
  context_data JSONB NOT NULL,
  suggestions JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON product_categories(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_cake_designs_status ON cake_designs(status);
CREATE INDEX idx_cake_designs_date ON cake_designs(delivery_date);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cake_designs_updated_at BEFORE UPDATE ON cake_designs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_pages_updated_at BEFORE UPDATE ON content_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, name_zh, slug, description, description_zh) VALUES
('Birthday Cakes', '生日蛋糕', 'birthday-cakes', 'Delicious homemade birthday cakes for all ages', '适合各个年龄段的美味自制生日蛋糕'),
('Wedding Cakes', '婚礼蛋糕', 'wedding-cakes', 'Elegant wedding cakes for your special day', '为您的特殊日子准备的优雅婚礼蛋糕'),
('Cupcakes', '纸杯蛋糕', 'cupcakes', 'Individual portion cupcakes with natural ingredients', '使用天然食材制作的单人份纸杯蛋糕'),
('Custom Cakes', '定制蛋糕', 'custom-cakes', 'Personalized cakes designed just for you', '专为您设计的个性化蛋糕'),
('Healthy Options', '健康选择', 'healthy-options', 'Sugar-free, gluten-free, and vegan cake options', '无糖、无麸质和素食蛋糕选择');

-- Insert default site settings
INSERT INTO site_settings (key, value, type, description, group_name) VALUES
('site_name', '"Healthy Cakes"', 'text', 'Website name', 'general'),
('site_name_zh', '"健康蛋糕"', 'text', 'Website name in Chinese', 'general'),
('site_description', '"Homemade healthy cakes with no artificial ingredients"', 'textarea', 'Site description', 'general'),
('site_description_zh', '"无人工添加剂的自制健康蛋糕"', 'textarea', 'Site description in Chinese', 'general'),
('contact_email', '"hello@healthycakes.com"', 'email', 'Contact email', 'contact'),
('contact_phone', '"+1 (555) 123-4567"', 'tel', 'Contact phone', 'contact'),
('business_hours', '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-18:00", "saturday": "10:00-16:00", "sunday": "closed"}', 'json', 'Business hours', 'contact'),
('delivery_areas', '["Downtown", "Suburbs", "City Center"]', 'json', 'Delivery areas', 'delivery'),
('min_order_amount', '25.00', 'number', 'Minimum order amount for delivery', 'delivery'),
('delivery_fee', '5.00', 'number', 'Standard delivery fee', 'delivery'),
('advance_order_days', '2', 'number', 'Minimum days for advance orders', 'orders'),
('enable_3d_designer', 'true', 'boolean', 'Enable 3D cake designer', 'features'),
('enable_ai_suggestions', 'true', 'boolean', 'Enable AI suggestions', 'features'),
('currency', '"USD"', 'text', 'Default currency', 'payment'),
('tax_rate', '0.08', 'number', 'Tax rate (as decimal)', 'payment');