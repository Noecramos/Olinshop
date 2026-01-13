// Create a test store for OlinShop with the new logo
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function createTestStore() {
    console.log('🏪 Creating test store for OlinShop...\n');

    try {
        // Create a test store
        const result = await sql`
            INSERT INTO restaurants (
                name,
                slug,
                responsible_name,
                email,
                whatsapp,
                address,
                hours,
                type,
                image,
                pix_key,
                password,
                approved,
                popular_title,
                welcome_subtitle
            ) VALUES (
                'OlinShop Fashion',
                'olinshop-fashion',
                'Admin OlinShop',
                'admin@olinshop.com',
                '5581999999999',
                'Rua do Comércio, 123, Olinda - PE',
                'Seg-Sex: 9h às 18h',
                'Vestuário',
                '/olinshop-logo.png',
                'admin@olinshop.com',
                'olinshop123',
                true,
                'Produtos em Destaque',
                'Bem-vindo ao OlinShop! 🛍️'
            )
            ON CONFLICT (slug) DO UPDATE SET
                name = EXCLUDED.name,
                image = EXCLUDED.image,
                updated_at = NOW()
            RETURNING id, name, slug
        `;

        console.log('✅ Test store created successfully!');
        console.log(`   Name: ${result.rows[0].name}`);
        console.log(`   Slug: ${result.rows[0].slug}`);
        console.log(`   ID: ${result.rows[0].id}\n`);

        // Update global config with the new logo
        await sql`
            INSERT INTO global_settings (key, value)
            VALUES ('headerImage', '/olinshop-logo.png')
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = NOW()
        `;

        await sql`
            INSERT INTO global_settings (key, value)
            VALUES ('welcomeTitle', 'Descubra as melhores lojas de Olinda!')
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = NOW()
        `;

        await sql`
            INSERT INTO global_settings (key, value)
            VALUES ('welcomeSubtitle', 'Shopping Online')
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = NOW()
        `;

        console.log('✅ Global config updated with new logo!\n');
        console.log('🎉 Setup complete!');
        console.log('\n📝 Access your test store at:');
        console.log('   http://localhost:3000/loja/olinshop-fashion');
        console.log('\n🔐 Admin credentials:');
        console.log('   Slug: olinshop-fashion');
        console.log('   Password: olinshop123\n');

    } catch (error) {
        console.error('❌ Failed to create test store:', error);
        throw error;
    }
}

createTestStore()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
