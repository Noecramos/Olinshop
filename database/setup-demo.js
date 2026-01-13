// Complete OlinShop setup with demo data
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function setupComplete() {
    console.log('🚀 Setting up complete OlinShop demo...\n');

    try {
        // 1. Update global config with new header
        console.log('📸 Updating header image...');
        await sql`
            INSERT INTO global_settings (key, value)
            VALUES ('headerImage', '/olinshop-header.png')
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = NOW()
        `;
        console.log('✅ Header image updated\n');

        // 2. Create demo store
        console.log('🏪 Creating demo store...');
        const storeResult = await sql`
            INSERT INTO restaurants (
                name, slug, responsible_name, email, whatsapp,
                address, hours, type, image, pix_key, password, approved,
                popular_title, welcome_subtitle, delivery_fee, delivery_time
            ) VALUES (
                'OlinShop Fashion Store',
                'olinshop-demo',
                'Demo Admin',
                'demo@olinshop.com',
                '5581987654321',
                'Av. Principal, 456, Olinda - PE',
                'Seg-Sáb: 9h às 20h',
                'Vestuário / Moda',
                '/olinshop-logo.png',
                'demo@olinshop.com',
                'demo123',
                true,
                '✨ Produtos em Destaque',
                'Moda e Estilo para Você! 👗',
                5.00,
                '30-45 min'
            )
            ON CONFLICT (slug) DO UPDATE SET
                name = EXCLUDED.name,
                image = EXCLUDED.image,
                approved = true,
                updated_at = NOW()
            RETURNING id, slug
        `;

        const storeId = storeResult.rows[0].id;
        console.log(`✅ Demo store created: ${storeResult.rows[0].slug}\n`);

        // 3. Create categories
        console.log('📂 Creating categories...');
        const categories = ['Roupas', 'Calçados', 'Acessórios', 'Bolsas'];

        for (const cat of categories) {
            await sql`
                INSERT INTO categories (restaurant_id, name)
                VALUES (${storeId}, ${cat})
                ON CONFLICT (restaurant_id, name) DO NOTHING
            `;
        }
        console.log(`✅ Created ${categories.length} categories\n`);

        // 4. Create demo products
        console.log('📦 Creating demo products...');
        const products = [
            {
                name: 'Vestido Floral Elegante',
                description: 'Vestido longo com estampa floral, perfeito para ocasiões especiais',
                price: 189.90,
                category: 'Roupas',
                image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
            },
            {
                name: 'Blusa Casual Branca',
                description: 'Blusa básica de algodão, confortável para o dia a dia',
                price: 79.90,
                category: 'Roupas',
                image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400'
            },
            {
                name: 'Calça Jeans Skinny',
                description: 'Calça jeans de cintura alta, modelagem skinny',
                price: 149.90,
                category: 'Roupas',
                image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'
            },
            {
                name: 'Tênis Esportivo Premium',
                description: 'Tênis confortável para corrida e academia',
                price: 299.90,
                category: 'Calçados',
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
            },
            {
                name: 'Sandália Rasteira',
                description: 'Sandália confortável para o verão',
                price: 89.90,
                category: 'Calçados',
                image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400'
            },
            {
                name: 'Bolsa Transversal',
                description: 'Bolsa pequena e prática para o dia a dia',
                price: 129.90,
                category: 'Bolsas',
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'
            },
            {
                name: 'Relógio Minimalista',
                description: 'Relógio elegante com pulseira de couro',
                price: 249.90,
                category: 'Acessórios',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
            },
            {
                name: 'Óculos de Sol Aviador',
                description: 'Óculos clássico com proteção UV',
                price: 159.90,
                category: 'Acessórios',
                image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400'
            }
        ];

        for (const product of products) {
            await sql`
                INSERT INTO products (restaurant_id, name, description, price, category, image)
                VALUES (${storeId}, ${product.name}, ${product.description}, ${product.price}, ${product.category}, ${product.image})
            `;
        }
        console.log(`✅ Created ${products.length} demo products\n`);

        console.log('🎉 Complete setup finished!\n');
        console.log('📝 Demo Store Details:');
        console.log('   URL: http://localhost:3000/loja/olinshop-demo');
        console.log('   Admin: http://localhost:3000/admin');
        console.log('   Slug: olinshop-demo');
        console.log('   Password: demo123\n');

    } catch (error) {
        console.error('❌ Setup failed:', error);
        throw error;
    }
}

setupComplete()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
