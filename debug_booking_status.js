const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function debugStatus() {
    console.log('🔍 DIAGNOSTIC REPORT\n');

    try {
        // 1. Check Stores
        console.log('🏪 STORES:');
        const stores = await sql`
            SELECT id, name, type, is_open, booking_enabled, booking_mode 
            FROM restaurants 
            ORDER BY name
        `;
        console.table(stores.rows);

        // 2. Check "Tosa" Products
        console.log('\n✂️ "TOSA" PRODUCTS:');
        const products = await sql`
            SELECT p.id, p.name, p.restaurant_id, p.is_service, p.requires_booking, r.name as restaurant_name
            FROM products p
            JOIN restaurants r ON p.restaurant_id = r.id
            WHERE p.name ILIKE '%Tosa%'
        `;
        console.table(products.rows);

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
