require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function setSuperAdmin() {
    try {
        await sql`
            INSERT INTO global_settings (key, value) 
            VALUES ('super_admin_password', 'OLIN-SHOP-123') 
            ON CONFLICT (key) DO UPDATE SET value = 'OLIN-SHOP-123'
        `;
        console.log('✅ Super Admin Password set to: OLIN-SHOP-123');
        process.exit(0);
    } catch (e) {
        console.error('❌ Error:', e.message);
        process.exit(1);
    }
}

setSuperAdmin();
