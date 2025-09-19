-- Sample data for Healthy Cake Shop
-- This file contains sample data to get started

-- Insert sample products
INSERT INTO products (
  name, name_zh, slug, description, description_zh, short_description, short_description_zh,
  price, compare_at_price, sku,
  ingredients, ingredients_zh, allergens, allergens_zh,
  nutritional_info, calories_per_serving, serving_size,
  is_organic, is_gluten_free, is_vegan, is_sugar_free,
  weight_grams, serves_people, preparation_time_hours, shelf_life_days,
  storage_instructions, storage_instructions_zh,
  status, is_featured, is_customizable
) VALUES
(
  'Organic Chocolate Birthday Cake',
  '有机巧克力生日蛋糕',
  'organic-chocolate-birthday-cake',
  'Rich, moist chocolate cake made with organic cocoa and natural sweeteners. Perfect for birthday celebrations with a healthy twist.',
  '用有机可可和天然甜味剂制成的浓郁湿润巧克力蛋糕。健康的生日庆祝完美选择。',
  'Organic chocolate cake with natural sweeteners',
  '有机巧克力蛋糕配天然甜味剂',
  45.00, 55.00, 'CHOC-BIRTH-001',
  ARRAY['Organic flour', 'Organic cocoa powder', 'Coconut oil', 'Maple syrup', 'Free-range eggs', 'Vanilla extract'],
  ARRAY['有机面粉', '有机可可粉', '椰子油', '枫糖浆', '散养鸡蛋', '香草精'],
  ARRAY['Eggs', 'Gluten'],
  ARRAY['鸡蛋', '麸质'],
  '{"protein": "6g", "carbs": "35g", "fat": "12g", "fiber": "4g", "sugar": "18g"}',
  280, '1 slice (100g)',
  true, false, false, false,
  800, 8, 3, 5,
  'Store in refrigerator. Best consumed within 5 days.',
  '储存在冰箱中。最好在5天内食用。',
  'active', true, true
),
(
  'Gluten-Free Vanilla Cupcakes',
  '无麸质香草纸杯蛋糕',
  'gluten-free-vanilla-cupcakes',
  'Light and fluffy gluten-free vanilla cupcakes topped with natural cream cheese frosting. Made with almond flour and coconut sugar.',
  '轻盈蓬松的无麸质香草纸杯蛋糕，配天然奶油奶酪糖霜。用杏仁粉和椰糖制成。',
  'Gluten-free cupcakes with cream cheese frosting',
  '无麸质纸杯蛋糕配奶油奶酪糖霜',
  24.00, NULL, 'CUPC-VAN-001',
  ARRAY['Almond flour', 'Coconut sugar', 'Free-range eggs', 'Vanilla extract', 'Baking powder', 'Cream cheese', 'Coconut cream'],
  ARRAY['杏仁粉', '椰糖', '散养鸡蛋', '香草精', '泡打粉', '奶油奶酪', '椰奶'],
  ARRAY['Eggs', 'Nuts (Almonds)', 'Dairy'],
  ARRAY['鸡蛋', '坚果（杏仁）', '乳制品'],
  '{"protein": "4g", "carbs": "22g", "fat": "8g", "fiber": "2g", "sugar": "12g"}',
  180, '1 cupcake (60g)',
  true, true, false, false,
  360, 6, 2, 4,
  'Store in airtight container at room temperature for 2 days or refrigerate for 4 days.',
  '在室温下密封保存2天或冷藏保存4天。',
  'active', true, false
),
(
  'Vegan Carrot Cake',
  '素食胡萝卜蛋糕',
  'vegan-carrot-cake',
  'Moist and spiced vegan carrot cake with cashew cream frosting. Made with organic carrots, whole wheat flour, and natural spices.',
  '湿润香料素食胡萝卜蛋糕配腰果奶油糖霜。用有机胡萝卜、全麦面粉和天然香料制成。',
  'Vegan carrot cake with cashew frosting',
  '素食胡萝卜蛋糕配腰果糖霜',
  38.00, NULL, 'CARR-VEG-001',
  ARRAY['Whole wheat flour', 'Organic carrots', 'Coconut oil', 'Applesauce', 'Maple syrup', 'Cinnamon', 'Cashews', 'Coconut cream'],
  ARRAY['全麦面粉', '有机胡萝卜', '椰子油', '苹果酱', '枫糖浆', '肉桂', '腰果', '椰奶'],
  ARRAY['Gluten', 'Nuts (Cashews)'],
  ARRAY['麸质', '坚果（腰果）'],
  '{"protein": "5g", "carbs": "28g", "fat": "10g", "fiber": "3g", "sugar": "15g"}',
  220, '1 slice (80g)',
  true, false, true, false,
  700, 8, 3, 6,
  'Store covered in refrigerator. Best within 6 days.',
  '在冰箱中覆盖保存。最好在6天内食用。',
  'active', false, false
),
(
  'Sugar-Free Lemon Pound Cake',
  '无糖柠檬磅蛋糕',
  'sugar-free-lemon-pound-cake',
  'Classic pound cake sweetened with stevia and fresh lemon zest. Perfect for those watching their sugar intake without compromising on taste.',
  '用甜菊糖和新鲜柠檬皮调味的经典磅蛋糕。完美适合控制糖分摄入而不妥协口味的人。',
  'Sugar-free pound cake with fresh lemon',
  '无糖磅蛋糕配新鲜柠檬',
  32.00, 42.00, 'LEMON-SF-001',
  ARRAY['Almond flour', 'Stevia', 'Free-range eggs', 'Butter', 'Fresh lemon zest', 'Lemon juice', 'Baking powder'],
  ARRAY['杏仁粉', '甜菊糖', '散养鸡蛋', '黄油', '新鲜柠檬皮', '柠檬汁', '泡打粉'],
  ARRAY['Eggs', 'Dairy', 'Nuts (Almonds)'],
  ARRAY['鸡蛋', '乳制品', '坚果（杏仁）'],
  '{"protein": "6g", "carbs": "8g", "fat": "14g", "fiber": "3g", "sugar": "2g"}',
  150, '1 slice (70g)',
  false, true, false, true,
  560, 8, 2, 7,
  'Store at room temperature in airtight container for 3 days or refrigerate for 7 days.',
  '在室温下密封保存3天或冷藏保存7天。',
  'active', false, false
),
(
  'Wedding Elegance Cake',
  '优雅婚礼蛋糕',
  'wedding-elegance-cake',
  'Three-tier elegant wedding cake with vanilla sponge, berry filling, and natural cream frosting. Customizable decorations available.',
  '三层优雅婚礼蛋糕，香草海绵，浆果馅，天然奶油糖霜。可定制装饰。',
  'Three-tier wedding cake with berry filling',
  '三层婚礼蛋糕配浆果馅',
  180.00, 220.00, 'WEDD-ELEG-001',
  ARRAY['Organic flour', 'Free-range eggs', 'Natural vanilla', 'Heavy cream', 'Fresh berries', 'Organic sugar', 'Butter'],
  ARRAY['有机面粉', '散养鸡蛋', '天然香草', '重奶油', '新鲜浆果', '有机糖', '黄油'],
  ARRAY['Eggs', 'Dairy', 'Gluten'],
  ARRAY['鸡蛋', '乳制品', '麸质'],
  '{"protein": "5g", "carbs": "32g", "fat": "11g", "fiber": "2g", "sugar": "20g"}',
  320, '1 slice (120g)',
  true, false, false, false,
  2500, 25, 6, 3,
  'Must be refrigerated. Order 3 days in advance.',
  '必须冷藏。需提前3天订购。',
  'active', true, true
);

-- Link products to categories
INSERT INTO product_categories (product_id, category_id) VALUES
((SELECT id FROM products WHERE slug = 'organic-chocolate-birthday-cake'), (SELECT id FROM categories WHERE slug = 'birthday-cakes')),
((SELECT id FROM products WHERE slug = 'gluten-free-vanilla-cupcakes'), (SELECT id FROM categories WHERE slug = 'cupcakes')),
((SELECT id FROM products WHERE slug = 'gluten-free-vanilla-cupcakes'), (SELECT id FROM categories WHERE slug = 'healthy-options')),
((SELECT id FROM products WHERE slug = 'vegan-carrot-cake'), (SELECT id FROM categories WHERE slug = 'healthy-options')),
((SELECT id FROM products WHERE slug = 'sugar-free-lemon-pound-cake'), (SELECT id FROM categories WHERE slug = 'healthy-options')),
((SELECT id FROM products WHERE slug = 'wedding-elegance-cake'), (SELECT id FROM categories WHERE slug = 'wedding-cakes'));

-- Insert sample product images
INSERT INTO product_images (product_id, url, alt_text, alt_text_zh, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug = 'organic-chocolate-birthday-cake'), '/images/products/chocolate-birthday-cake-1.jpg', 'Organic chocolate birthday cake with candles', '有机巧克力生日蛋糕配蜡烛', 0, true),
((SELECT id FROM products WHERE slug = 'organic-chocolate-birthday-cake'), '/images/products/chocolate-birthday-cake-2.jpg', 'Close-up of chocolate cake texture', '巧克力蛋糕质地特写', 1, false),
((SELECT id FROM products WHERE slug = 'gluten-free-vanilla-cupcakes'), '/images/products/vanilla-cupcakes-1.jpg', 'Gluten-free vanilla cupcakes with frosting', '无麸质香草纸杯蛋糕配糖霜', 0, true),
((SELECT id FROM products WHERE slug = 'vegan-carrot-cake'), '/images/products/carrot-cake-1.jpg', 'Vegan carrot cake slice', '素食胡萝卜蛋糕切片', 0, true),
((SELECT id FROM products WHERE slug = 'sugar-free-lemon-pound-cake'), '/images/products/lemon-cake-1.jpg', 'Sugar-free lemon pound cake', '无糖柠檬磅蛋糕', 0, true),
((SELECT id FROM products WHERE slug = 'wedding-elegance-cake'), '/images/products/wedding-cake-1.jpg', 'Three-tier elegant wedding cake', '三层优雅婚礼蛋糕', 0, true);

-- Insert product variants
INSERT INTO product_variants (product_id, name, name_zh, sku, price, weight_grams, serves_people, options) VALUES
((SELECT id FROM products WHERE slug = 'organic-chocolate-birthday-cake'), '6-inch cake', '6英寸蛋糕', 'CHOC-BIRTH-001-6', 35.00, 600, 6, '{"size": "6 inch"}'),
((SELECT id FROM products WHERE slug = 'organic-chocolate-birthday-cake'), '8-inch cake', '8英寸蛋糕', 'CHOC-BIRTH-001-8', 45.00, 800, 8, '{"size": "8 inch"}'),
((SELECT id FROM products WHERE slug = 'organic-chocolate-birthday-cake'), '10-inch cake', '10英寸蛋糕', 'CHOC-BIRTH-001-10', 65.00, 1200, 12, '{"size": "10 inch"}'),
((SELECT id FROM products WHERE slug = 'gluten-free-vanilla-cupcakes'), '6-pack', '6个装', 'CUPC-VAN-001-6', 24.00, 360, 6, '{"quantity": "6 cupcakes"}'),
((SELECT id FROM products WHERE slug = 'gluten-free-vanilla-cupcakes'), '12-pack', '12个装', 'CUPC-VAN-001-12', 45.00, 720, 12, '{"quantity": "12 cupcakes"}');

-- Insert sample content pages
INSERT INTO content_pages (slug, title, title_zh, content, content_zh, meta_title, meta_title_zh, meta_description, meta_description_zh, is_published) VALUES
('about', 'About Us', '关于我们',
'<h2>Our Story</h2><p>Welcome to Healthy Cakes, where we believe that delicious treats can also be nutritious and wholesome. Our journey began in 2020 when our founder, Sarah, decided to create cakes that her diabetic grandmother could enjoy without worry.</p><h3>Our Mission</h3><p>We are committed to using only the finest organic and natural ingredients in all our creations. No artificial preservatives, no artificial colors, and no artificial flavors - just pure, wholesome goodness.</p><h3>What Makes Us Special</h3><ul><li>100% organic ingredients where possible</li><li>No artificial additives</li><li>Custom dietary options (gluten-free, vegan, sugar-free)</li><li>Made fresh daily</li><li>Eco-friendly packaging</li></ul>',
'<h2>我们的故事</h2><p>欢迎来到健康蛋糕，我们相信美味的甜点也可以营养丰富。我们的旅程始于2020年，当时我们的创始人莎拉决定制作她患糖尿病的祖母可以放心享用的蛋糕。</p><h3>我们的使命</h3><p>我们致力于在所有创作中只使用最优质的有机和天然食材。没有人工防腐剂，没有人工色素，没有人工香料——只有纯净、健康的美味。</p><h3>我们的特色</h3><ul><li>尽可能使用100%有机食材</li><li>无人工添加剂</li><li>定制饮食选择（无麸质、素食、无糖）</li><li>每日新鲜制作</li><li>环保包装</li></ul>',
'About Healthy Cakes - Organic Homemade Cakes', '关于健康蛋糕 - 有机自制蛋糕',
'Learn about our commitment to healthy, organic baking and our mission to provide delicious cakes without artificial ingredients.',
'了解我们对健康有机烘焙的承诺以及提供无人工添加剂美味蛋糕的使命。',
true),

('delivery-info', 'Delivery Information', '配送信息',
'<h2>Delivery Areas</h2><p>We currently deliver to the following areas:</p><ul><li>Downtown area</li><li>Suburbs (within 15 miles)</li><li>City Center</li></ul><h3>Delivery Times</h3><p>We offer delivery slots between 9 AM and 6 PM, Monday through Saturday. Sunday deliveries are available for special orders with advance notice.</p><h3>Delivery Fees</h3><ul><li>Orders over $50: FREE delivery</li><li>Orders under $50: $5 delivery fee</li><li>Express delivery (same day): Additional $10</li></ul><h3>Pickup Option</h3><p>You can also pick up your order from our kitchen. Pickup is available 7 days a week from 8 AM to 7 PM.</p>',
'<h2>配送区域</h2><p>我们目前配送到以下区域：</p><ul><li>市中心区域</li><li>郊区（15英里内）</li><li>市中心</li></ul><h3>配送时间</h3><p>我们在周一至周六的上午9点到下午6点提供配送时段。周日配送适用于提前通知的特殊订单。</p><h3>配送费用</h3><ul><li>订单超过$50：免费配送</li><li>订单低于$50：$5配送费</li><li>快速配送（当日）：额外$10</li></ul><h3>取货选项</h3><p>您也可以从我们的厨房取货。取货时间为每周7天，上午8点到晚上7点。</p>',
'Delivery Information - Healthy Cakes', '配送信息 - 健康蛋糕',
'Information about our delivery areas, times, and fees for healthy organic cakes.',
'关于我们健康有机蛋糕的配送区域、时间和费用信息。',
true);

-- Insert sample coupons
INSERT INTO coupons (code, name, name_zh, description, description_zh, type, value, minimum_order_amount, usage_limit, starts_at, expires_at) VALUES
('WELCOME10', 'Welcome Discount', '欢迎折扣', 'Get 10% off your first order', '首次订购享受10%折扣', 'percentage', 10.00, 25.00, 100, NOW(), NOW() + INTERVAL '30 days'),
('FREESHIP', 'Free Shipping', '免费配送', 'Free shipping on any order', '任何订单免费配送', 'free_shipping', 0.00, 30.00, 50, NOW(), NOW() + INTERVAL '60 days'),
('BIRTHDAY20', 'Birthday Special', '生日特惠', '20% off birthday cakes', '生日蛋糕20%折扣', 'percentage', 20.00, 40.00, NULL, NOW(), NOW() + INTERVAL '90 days');

-- Insert sample customers (for testing)
INSERT INTO customers (email, first_name, last_name, phone, preferred_language, dietary_restrictions, marketing_consent, addresses) VALUES
('john.doe@example.com', 'John', 'Doe', '+1-555-0123', 'en', ARRAY['Gluten-free'], true,
'[{"type": "shipping", "street": "123 Main St", "city": "Springfield", "state": "IL", "zip": "62701", "country": "US", "is_default": true}]'),
('li.wei@example.com', 'Wei', 'Li', '+1-555-0124', 'zh', ARRAY['Vegan'], true,
'[{"type": "shipping", "street": "456 Oak Ave", "city": "Springfield", "state": "IL", "zip": "62702", "country": "US", "is_default": true}]');

-- Create a sample custom cake design
INSERT INTO cake_designs (
  customer_email, customer_name, customer_phone,
  design_data, cake_type, size, serves_people,
  flavors, colors, decorations, special_requests,
  base_price, customization_price, total_price,
  delivery_date, delivery_time, delivery_address,
  status
) VALUES (
  'sarah.johnson@example.com', 'Sarah Johnson', '+1-555-0125',
  '{"layers": [{"flavor": "vanilla", "size": "8inch", "height": "3inch", "decorations": ["roses", "pearls"]}], "colors": ["pink", "white"], "text": "Happy Birthday Sarah!"}',
  'Birthday Cake', '8 inch', 10,
  ARRAY['Vanilla sponge', 'Strawberry filling'],
  ARRAY['Pink', 'White', 'Gold'],
  ARRAY['Sugar roses', 'Edible pearls', 'Gold details'],
  'Please write "Happy Birthday Sarah!" in elegant script',
  45.00, 25.00, 70.00,
  CURRENT_DATE + INTERVAL '5 days', '14:00:00',
  '789 Elm Street, Springfield, IL 62703',
  'confirmed'
);