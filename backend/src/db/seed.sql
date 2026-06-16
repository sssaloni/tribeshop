-- Seed script for TribeShop Database

-- Insert default admin user (username: admin, password: adminpassword123)
-- Hash generated using bcryptjs (rounds: 10)
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$6BpARb8rVCde.pwpLAxQY.AbSFhhqrnASQhK3Vk3hRPFXY7mJSVtC')
ON CONFLICT (username) DO NOTHING;

-- Insert initial products
INSERT INTO products (name, description, price, image_url, category, stock_quantity)
VALUES 
(
  'Tribe Wireless Pro Headset', 
  'Immersive sound experience with active noise cancellation, 40-hour battery life, and ultra-soft memory foam earcups.', 
  199.99, 
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', 
  'Electronics', 
  25
),
(
  'Tribe Smart Sport Watch', 
  'Track your heart rate, sleep, steps, and workouts. Features a high-resolution AMOLED always-on screen and 7-day battery.', 
  149.99, 
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', 
  'Electronics', 
  15
),
(
  'Urban Nomad Backpack', 
  'Water-resistant, anti-theft design with dedicated 16-inch laptop compartment and integrated USB charging port.', 
  79.50, 
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', 
  'Accessories', 
  40
),
(
  'Vintage Leather Journal', 
  'Handcrafted genuine leather notebook with 200 pages of premium deckled edge paper. Perfect for sketching or writing.', 
  29.99, 
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80', 
  'Accessories', 
  50
),
(
  'Classic Fleece Hoodie', 
  'Premium organic cotton blend fleece hoodie. Features relaxed fit, double-lined hood, and kangaroo pocket.', 
  59.99, 
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80', 
  'Apparel', 
  30
),
(
  'Minimalist Leather Sneakers', 
  'Timeless design handcrafted from full-grain leather. Features custom rubber outsoles and ultra-comfortable insoles.', 
  110.00, 
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80', 
  'Apparel', 
  20
),
(
  'Dimmable Ambient Desk Lamp', 
  'Modern wood base lamp with soft fabric shade, 3 brightness levels, touch control, and dual USB ports.', 
  45.00, 
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80', 
  'Home', 
  12
),
(
  'Double-Wall Insulated Tumbler', 
  '32oz stainless steel travel mug, keeps drinks cold for 24 hours or hot for 12 hours. Sweat-proof finish.', 
  24.99, 
  'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80', 
  'Accessories', 
  60
);
