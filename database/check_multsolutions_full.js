const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function check() {
    try {
        console.log("Checking multsolutions store (full details)...\n");
        const { rows } = await sql`
            SELECT * 
            FROM restaurants 
            WHERE slug = 'multsolutions'
            LIMIT 1;
        `;

        if (rows.length === 0) {
            console.log("❌ Store 'multsolutions' NOT FOUND in database");
        } else {
            console.log("✅ Store found:");
            console.log(JSON.stringify(rows[0], null, 2));

            const store = rows[0];

            console.log("\n=== VISIBILITY CHECKLIST ===");
            console.log(`✅ Approved: ${store.approved}`);
            console.log(`📧 Email: ${store.email}`);
            console.log(`🔗 Slug: ${store.slug}`);
            console.log(`📅 Created: ${store.created_at}`);
            console.log(`🔄 Updated: ${store.updated_at}`);

            if (store.subscription_status) {
                console.log(`💳 Subscription Status: ${store.subscription_status}`);
                console.log(`📅 Subscription Expires: ${store.subscription_expires_at}`);
            }

            if (store.multistore_enabled) {
                console.log(`🏪 Multistore Enabled: ${store.multistore_enabled}`);
            }
        }
    } catch (error) {
        console.error("Check failed:", error);
    }
}

check();
