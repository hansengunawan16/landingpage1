-- Category: Women's Collection
INSERT INTO categories (id, name, slug) 
VALUES ('d1234567-e89a-12d3-a456-426614174000', 'WOMEN', 'women') 
ON CONFLICT (id) DO NOTHING;

-- Products: Alpex Women Line
INSERT INTO products (id, name, slug, description, base_price, "categoryId") 
VALUES 
('d1234567-e89a-12d3-a456-426614174001', 'MINIMALIST BLOUSE', 'minimalist-blouse', 'Premium silk blouse in beige, minimalist design.', 599000, 'd1234567-e89a-12d3-a456-426614174000'),
('d1234567-e89a-12d3-a456-426614174002', 'TAILORED PANTS', 'tailored-pants', 'Grey tailored trousers with a modern silhouette.', 799000, 'd1234567-e89a-12d3-a456-426614174000'),
('d1234567-e89a-12d3-a456-426614174003', 'CASUAL DRESS', 'casual-dress', 'Cream-colored dress with a premium cotton knit.', 899000, 'd1234567-e89a-12d3-a456-426614174000'),
('d1234567-e89a-12d3-a456-426614174004', 'WOMEN SNEAKERS', 'women-sneakers', 'Clean white minimalist sneakers with leather accents.', 1299000, 'd1234567-e89a-12d3-a456-426614174000'),
('d1234567-e89a-12d3-a456-426614174005', 'ELEGANT WATCH', 'elegant-watch', 'Sophisticated silver wrist watch with a minimalist dial.', 2499000, 'd1234567-e89a-12d3-a456-426614174000')
ON CONFLICT (id) DO NOTHING;

-- Inventory: Initial stock for Women's Line
INSERT INTO inventory (id, sku, size, color, stock_quantity, "productId") 
VALUES 
(gen_random_uuid(), 'AW-BLS-BEG', 'M', 'Beige', 25, 'd1234567-e89a-12d3-a456-426614174001'),
(gen_random_uuid(), 'AW-PNT-GRY', '28', 'Grey', 30, 'd1234567-e89a-12d3-a456-426614174002'),
(gen_random_uuid(), 'AW-DRS-CRM', 'M', 'Cream', 20, 'd1234567-e89a-12d3-a456-426614174003'),
(gen_random_uuid(), 'AW-SNK-WHT', '38', 'White', 15, 'd1234567-e89a-12d3-a456-426614174004'),
(gen_random_uuid(), 'AW-WTC-SLV', 'OS', 'Silver', 10, 'd1234567-e89a-12d3-a456-426614174005')
ON CONFLICT DO NOTHING;
