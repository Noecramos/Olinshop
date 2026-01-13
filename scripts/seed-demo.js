// Script to seed demo shop data
const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function seedDemoShop() {
    try {
        console.log('🌱 Starting demo shop seed...');

        // Read the SQL file
        const sqlFile = fs.readFileSync(
            path.join(__dirname, '../database/seed-demo-shop.sql'),
            'utf8'
        );

        // Execute the SQL
        await sql.query(sqlFile);

        console.log('✅ Demo shop seeded successfully!');
        console.log('');
        console.log('📦 Shop Details:');
        console.log('   Name: Fashion Store Demo');
        console.log('   Slug: fashion-demo');
        console.log('   Password: demo123');
        console.log('   URL: http://localhost:3000/loja/fashion-demo');
        console.log('   Admin: http://localhost:3000/admin/fashion-demo');
        console.log('');
        console.log('🛍️  10 products created with variants (size, color, etc.)');

    } catch (error) {
        console.error('❌ Error seeding demo shop:', error);
        process.exit(1);
    }
}

seedDemoShop();
