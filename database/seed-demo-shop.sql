-- Demo Fashion Store Seed Data
-- This script creates a demo shop with products that have variants (size, color, etc.)

-- First, check if the shop exists, if not create it
INSERT INTO restaurants (
    name, 
    slug, 
    responsible_name, 
    email, 
    whatsapp, 
    instagram,
    zip_code,
    address,
    hours,
    type,
    image,
    pix_key,
    password,
    approved,
    delivery_fee,
    delivery_time
) VALUES (
    'Fashion Store Demo',
    'fashion-demo',
    'Admin Demo',
    'demo@fashionstore.com',
    '5581999887766',
    '@fashionstore',
    '50010000',
    'Av. Guararapes, 100, Santo Antônio, Recife, PE',
    'Seg-Sex 9h às 18h',
    'Moda',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    'demo@fashionstore.com',
    'demo123',
    true,
    0,
    '30-45 min'
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    approved = true;

-- Get the restaurant ID (we'll use it for categories and products)
DO $$
DECLARE
    v_restaurant_id UUID;
BEGIN
    -- Get the restaurant ID
    SELECT id INTO v_restaurant_id FROM restaurants WHERE slug = 'fashion-demo';

    -- Delete existing categories and products for this restaurant
    DELETE FROM categories WHERE restaurant_id = v_restaurant_id;
    DELETE FROM products WHERE restaurant_id = v_restaurant_id;

    -- Insert Categories
    INSERT INTO categories (restaurant_id, name) VALUES
        (v_restaurant_id, 'Roupas Femininas'),
        (v_restaurant_id, 'Roupas Masculinas'),
        (v_restaurant_id, 'Calçados'),
        (v_restaurant_id, 'Acessórios');

    -- Insert Products with Variants
    
    -- Product 1: Camiseta Oversized (Size + Color)
    INSERT INTO products (restaurant_id, name, price, category, description, image, variants) VALUES
    (v_restaurant_id, 'Camiseta Oversized', 89.90, 'Roupas Femininas', 
     'Camiseta oversized 100% algodão, modelagem ampla e confortável. Perfeita para o dia a dia.',
     'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
     '[
         {"name": "Tamanho", "options": ["P", "M", "G", "GG"]},
         {"name": "Cor", "options": ["Preto", "Branco", "Azul", "Rosa"]}
     ]'::jsonb);

    -- Product 2: Calça Jeans Skinny (Size only)
    INSERT INTO products (restaurant_id, name, price, category, description, image, variants) VALUES
    (v_restaurant_id, 'Calça Jeans Skinny', 159.90, 'Roupas Femininas',
     'Calça jeans skinny de cintura alta, tecido stretch para maior conforto e mobilidade.',
     'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
     '[
         {"name": "Tamanho", "options": ["36", "38", "40", "42", "44"]}
     ]'::jsonb);

    -- Product 3: Tênis Casual (Size + Color)
    INSERT INTO products (restaurant_id, name, price, category, description, image, variants) VALUES
    (v_restaurant_id, 'Tênis Casual Unissex', 249.90, 'Calçados',
     'Tênis casual confortável, solado de borracha antiderrapante. Ideal para uso diário.',
     'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
     '[
         {"name": "Tamanho", "options": ["37", "38", "39", "40", "41", "42", "43"]},
         {"name": "Cor", "options": ["Preto", "Branco", "Vermelho", "Azul"]}
     ]'::jsonb);

    -- Product 4: Camisa Social Masculina (Size + Color)
    INSERT INTO products (restaurant_id, name, price, category, description, image, variants) VALUES
    (v_restaurant_id, 'Camisa Social Slim Fit', 129.90, 'Roupas Masculinas',
     'Camisa social slim fit, tecido de alta qualidade com toque macio. Perfeita para o trabalho.',
     'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
     '[
         {"name": "Tamanho", "options": ["P", "M", "G", "GG"]},
         {"name": "Cor", "options": ["Branco", "Azul Claro", "Preto", "Cinza"]}
     ]'::jsonb);

    -- Product 5: Boné Snapback (Color only)
    INSERT INTO products (restaurant_id, name, price, category, description, image, variants) VALUES
    (v_restaurant_id, 'Boné Snapback', 69.90, 'Acessórios',
     'Boné snapback ajustável, aba reta. Material resistente e confortável.',
     'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
     '[
         {"name": "Cor", "options": ["Preto", "Azul", "Verde", "Vermelho", "Branco"]}
     ]'::jsonb);

    -- Product 6: Relógio Digital (Color only)
    INSERT INTO products (restaurant_id, name, price, category, description, image, variants) VALUES
    (v_restaurant_id, 'Relógio Digital Esportivo', 199.90, 'Acessórios',
     'Relógio digital esportivo à prova d''água, cronômetro e alarme. Pulseira de silicone.',
     'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
     '[
         {"name": "Cor", "options": ["Prata", "Dourado", "Preto", "Rose"]}
     ]'::jsonb);

    -- Product 7: Vestido Midi (Size + Color)
    INSERT INTO products (restaurant_id, name, price, category, description, image, variants) VALUES
    (v_restaurant_id, 'Vestido Midi Floral', 179.90, 'Roupas Femininas',
     'Vestido midi com estampa floral, tecido leve e fluido. Perfeito para o verão.',
     'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
     '[
         {"name": "Tamanho", "options": ["P", "M", "G", "GG"]},
         {"name": "Cor", "options": ["Floral Azul", "Floral Rosa", "Floral Verde"]}
     ]'::jsonb);

    -- Product 8: Jaqueta Jeans (Size only)
    INSERT INTO products (restaurant_id, name, price, category, description, image, variants) VALUES
    (v_restaurant_id, 'Jaqueta Jeans Clássica', 219.90, 'Roupas Masculinas',
     'Jaqueta jeans clássica, corte reto. Material durável e atemporal.',
     'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
     '[
         {"name": "Tamanho", "options": ["P", "M", "G", "GG", "XGG"]}
     ]'::jsonb);

    -- Product 9: Mochila Urbana (Color only)
    INSERT INTO products (restaurant_id, name, price, category, description, image, variants) VALUES
    (v_restaurant_id, 'Mochila Urbana Impermeável', 149.90, 'Acessórios',
     'Mochila urbana com compartimento para notebook, material impermeável.',
     'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
     '[
         {"name": "Cor", "options": ["Preto", "Cinza", "Azul Marinho", "Verde Militar"]}
     ]'::jsonb);

    -- Product 10: Shorts Esportivo (Size + Color)
    INSERT INTO products (restaurant_id, name, price, category, description, image, variants) VALUES
    (v_restaurant_id, 'Shorts Esportivo Dry Fit', 79.90, 'Roupas Masculinas',
     'Shorts esportivo com tecnologia dry fit, secagem rápida. Ideal para treinos.',
     'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
     '[
         {"name": "Tamanho", "options": ["P", "M", "G", "GG"]},
         {"name": "Cor", "options": ["Preto", "Azul", "Cinza", "Verde"]}
     ]'::jsonb);

END $$;

-- Display success message
SELECT 'Demo shop "Fashion Store Demo" created successfully!' as message,
       'Slug: fashion-demo' as slug,
       'Password: demo123' as password,
       'Products created: 10 with variants' as products;
