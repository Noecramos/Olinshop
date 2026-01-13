// Add missing is_open column to restaurants table
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function addIsOpenColumn() {
    console.log('🔧 Adding is_open column to restaurants table...\n');

    try {
        // Check if column exists and add if not
        await sql`
            ALTER TABLE restaurants 
            ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT true
        `;

        console.log('✅ Column added successfully!\n');

        // Verify the demo store exists
        const { rows } = await sql`
            SELECT id, name, slug, approved 
            FROM restaurants 
            WHERE slug = 'olinshop-demo'
        `;

        if (rows.length > 0) {
            console.log('✅ Demo store found:');
            console.log(`   Name: ${rows[0].name}`);
            console.log(`   Slug: ${rows[0].slug}`);
            console.log(`   Approved: ${rows[0].approved}`);
        } else {
            console.log('⚠️  Demo store not found. Run setup-demo.js first.');
        }

    } catch (error) {
        console.error('❌ Failed:', error);
        throw error;
    }
}

addIsOpenColumn()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
