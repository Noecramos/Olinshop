// Add multistore_enabled column to restaurants table
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function addMultistoreColumn() {
    console.log('🔧 Adding multistore_enabled column to restaurants table...\n');

    try {
        // Add the column
        await sql`
            ALTER TABLE restaurants 
            ADD COLUMN IF NOT EXISTS multistore_enabled BOOLEAN DEFAULT false
        `;

        console.log('✅ Column added successfully!\n');

        // Verify the change
        const { rows } = await sql`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'restaurants' 
            AND column_name = 'multistore_enabled'
        `;

        if (rows.length > 0) {
            console.log('📊 Column details:', rows[0]);
        }

        console.log('\n✅ Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

addMultistoreColumn()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
