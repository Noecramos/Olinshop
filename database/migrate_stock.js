
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
    try {
        console.log("Starting stock migration for OlinShop...");

        // Add track_stock and stock_quantity to products
        await sql`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS track_stock BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
        `;

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

migrate();
