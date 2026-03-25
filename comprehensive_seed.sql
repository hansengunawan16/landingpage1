-- Categories Initialization
INSERT INTO categories (id, name, slug) VALUES 
('c1000000-0000-0000-0000-000000000001', 'MEN', 'men'),
('c1000000-0000-0000-0000-000000000002', 'WOMEN', 'women'),
('c1000000-0000-0000-0000-000000000003', 'SHOES', 'shoes'),
('c1000000-0000-0000-0000-000000000004', 'CLOTHING', 'clothing'),
('c1000000-0000-0000-0000-000000000005', 'ACCESSORIES', 'accessories')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Products Seeding (10 Products)
INSERT INTO products (id, name, slug, description, base_price, "categoryId") VALUES
-- MEN (4 products)
('p1000000-0000-0000-0000-000000000001', 'ALPEX CLASSIC DERBY', 'men-classic-derby', 'Premium leather derby shoes for formal occasions.', 1450000, 'c1000000-0000-0000-0000-000000000001'),
('p1000000-0000-0000-0000-000000000002', 'ALPEX SPORT RUNNER', 'men-sport-runner', 'High-performance running shoes with breathable mesh.', 899000, 'c1000000-0000-0000-0000-000000000001'),
('p1000000-0000-0000-0000-000000000003', 'ALPEX TECH PARKA', 'men-tech-parka', 'Water-resistant parka with multiple utility pockets.', 2100000, 'c1000000-0000-0000-0000-000000000001'),
('p1000000-0000-0000-0000-000000000004', 'ALPEX ESSENTIAL CHINO', 'men-essential-chino', 'Comfortable slim-fit chinos for everyday wear.', 550000, 'c1000000-0000-0000-0000-000000000001'),

-- WOMEN (4 products)
('p1000000-0000-0000-0000-000000000005', 'ALPEX MINIMALIST HEELS', 'women-minimalist-heels', 'Elegant suede heels with a modern architectural heel.', 1100000, 'c1000000-0000-0000-0000-000000000002'),
('p1000000-0000-0000-0000-000000000006', 'ALPEX URBAN SNEAKER', 'women-urban-sneaker', 'Versatile urban sneakers with platform soles.', 950000, 'c1000000-0000-0000-0000-000000000002'),
('p1000000-0000-0000-0000-000000000007', 'ALPEX SILK BLOUSE', 'women-silk-blouse', 'Luxury silk blouse with a tailored silhouette.', 750000, 'c1000000-0000-0000-0000-000000000002'),
('p1000000-0000-0000-0000-000000000008', 'ALPEX TAILORED TROUSERS', 'women-tailored-trousers', 'High-waisted trousers with precise pleat detailing.', 850000, 'c1000000-0000-0000-0000-000000000002'),

-- ACCESSORIES (2 products)
('p1000000-0000-0000-0000-000000000009', 'ALPEX CHRONOGRAPH SILVER', 'chrono-silver-watch', 'Modern chronograph watch with a brushed steel bracelet.', 3200000, 'c1000000-0000-0000-0000-000000000005'),
('p1000000-0000-0000-0000-000000000010', 'ALPEX MINIMALIST GOLD', 'minimalist-gold-watch', 'Signature gold-plated watch with a sapphire dial.', 2800000, 'c1000000-0000-0000-0000-000000000005')
ON CONFLICT (slug) DO UPDATE SET 
name = EXCLUDED.name, 
description = EXCLUDED.description, 
base_price = EXCLUDED.base_price, 
"categoryId" = EXCLUDED."categoryId";

-- Inventory Seeding (Sizes & Stock)
INSERT INTO inventory (id, sku, size, color, stock_quantity, "productId") VALUES
-- Shoes Inventory
(gen_random_uuid(), 'MS-DER-BLK-40', '40', 'Black', 15, 'p1000000-0000-0000-0000-000000000001'),
(gen_random_uuid(), 'MS-DER-BLK-41', '41', 'Black', 15, 'p1000000-0000-0000-0000-000000000001'),
(gen_random_uuid(), 'MS-RUN-WHT-42', '42', 'White', 20, 'p1000000-0000-0000-0000-000000000002'),
(gen_random_uuid(), 'MS-RUN-WHT-43', '43', 'White', 20, 'p1000000-0000-0000-0000-000000000002'),

-- Clothing Inventory
(gen_random_uuid(), 'MC-PRK-OLV-M', 'M', 'Olive', 12, 'p1000000-0000-0000-0000-000000000003'),
(gen_random_uuid(), 'MC-PRK-OLV-L', 'L', 'Olive', 12, 'p1000000-0000-0000-0000-000000000003'),
(gen_random_uuid(), 'MC-CHN-NAV-32', '32', 'Navy', 25, 'p1000000-0000-0000-0000-000000000004'),
(gen_random_uuid(), 'MC-CHN-NAV-34', '34', 'Navy', 25, 'p1000000-0000-0000-0000-000000000004'),

-- Women Shoes Inventory
(gen_random_uuid(), 'WS-HEL-BLK-38', '38', 'Black', 10, 'p1000000-0000-0000-0000-000000000005'),
(gen_random_uuid(), 'WS-HEL-BLK-39', '39', 'Black', 10, 'p1000000-0000-0000-0000-000000000005'),
(gen_random_uuid(), 'WS-SNK-WHT-37', '37', 'White', 18, 'p1000000-0000-0000-0000-000000000006'),
(gen_random_uuid(), 'WS-SNK-WHT-38', '38', 'White', 18, 'p1000000-0000-0000-0000-000000000006'),

-- Women Clothing Inventory
(gen_random_uuid(), 'WC-BLS-CRM-S', 'S', 'Cream', 15, 'p1000000-0000-0000-0000-000000000007'),
(gen_random_uuid(), 'WC-BLS-CRM-M', 'M', 'Cream', 20, 'p1000000-0000-0000-0000-000000000007'),
(gen_random_uuid(), 'WC-TRZ-BLK-M', 'M', 'Black', 22, 'p1000000-0000-0000-0000-000000000008'),
(gen_random_uuid(), 'WC-TRZ-BLK-L', 'L', 'Black', 22, 'p1000000-0000-0000-0000-000000000008'),

-- Accessories Inventory
(gen_random_uuid(), 'AC-WTC-SLV-OS', 'OS', 'Silver', 25, 'p1000000-0000-0000-0000-000000000009'),
(gen_random_uuid(), 'AC-WTC-GLD-OS', 'OS', 'Gold', 15, 'p1000000-0000-0000-0000-000000000010')
ON CONFLICT DO NOTHING;
