// Verify OlinShop database connection
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function verifyConnection() {
    console.log('🔍 Verifying OlinShop database connection...\n');

    try {
        // Test connection
        const result = await sql`SELECT NOW() as current_time`;
        console.log('✅ Database connection successful!');
        console.log(`   Current database time: ${result.rows[0].current_time}\n`);

        // Check tables
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `;

        console.log('📊 Tables in database:');
        tables.rows.forEach(row => {
            console.log(`   ✓ ${row.table_name}`);
        });
        console.log('');

        // Check restaurants count
        const restaurantCount = await sql`SELECT COUNT(*) as count FROM restaurants`;
        console.log(`🏪 Restaurants: ${restaurantCount.rows[0].count}`);

        const productCount = await sql`SELECT COUNT(*) as count FROM products`;
        console.log(`📦 Products: ${productCount.rows[0].count}`);

        const orderCount = await sql`SELECT COUNT(*) as count FROM orders`;
        console.log(`📋 Orders: ${orderCount.rows[0].count}`);

        const userCount = await sql`SELECT COUNT(*) as count FROM users`;
        console.log(`👥 Users: ${userCount.rows[0].count}\n`);

        console.log('✅ OlinShop database is ready!');
        console.log('🔒 This is a completely separate database from Olindelivery.\n');

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        throw error;
    }
}

verifyConnection()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
