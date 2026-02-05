const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function debugStatus() {
    try {
        // 1. Find Pet Shops
        console.log('🏪 PET SHOPS / SERVICE STORES:');
        const stores = await sql`
            SELECT id, name, slug, type, is_open, booking_enabled, booking_mode 
            FROM restaurants 
            WHERE type ILIKE '%Pet%' OR type ILIKE '%Barbearia%' OR type ILIKE '%Salão%'
        `;
        console.table(stores.rows);

        if (stores.rows.length > 0) {
            const petShopId = stores.rows[0].id;
            console.log(`\n📦 PRODUCTS FOR ${stores.rows[0].name} (${petShopId}):`);
            const products = await sql`
                SELECT id, name, is_service, requires_booking 
                FROM products 
                WHERE restaurant_id = ${petShopId}
                LIMIT 20
            `;
            console.table(products.rows);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

debugStatus()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
