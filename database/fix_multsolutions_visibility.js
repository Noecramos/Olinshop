const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function fixVisibility() {
    try {
        console.log("🔧 Fixing Multsolutions visibility...\n");

        // 1. Enable multistore for Multsolutions
        console.log("1️⃣ Enabling multistore for Multsolutions...");
        const { rows: multsolutions } = await sql`
            UPDATE restaurants 
            SET multistore_enabled = true, updated_at = NOW()
            WHERE slug = 'multsolutions'
            RETURNING id, name, slug, multistore_enabled, email;
        `;

        if (multsolutions.length > 0) {
            console.log("✅ Updated Multsolutions:");
            console.log(`   - Name: ${multsolutions[0].name}`);
            console.log(`   - Slug: ${multsolutions[0].slug}`);
            console.log(`   - Multistore: ${multsolutions[0].multistore_enabled}`);
        }

        // 2. Disable multistore for other stores with the same email
        console.log("\n2️⃣ Disabling multistore for other stores with email multsolutionspe@gmail.com...");
        const { rows: others } = await sql`
            UPDATE restaurants 
            SET multistore_enabled = false, updated_at = NOW()
            WHERE email = 'multsolutionspe@gmail.com' 
            AND slug != 'multsolutions'
            RETURNING id, name, slug, multistore_enabled;
        `;

        console.log(`✅ Updated ${others.length} other store(s):`);
        others.forEach(store => {
            console.log(`   - ${store.name} (${store.slug}) - multistore: ${store.multistore_enabled}`);
        });

        // 3. Verify the change
        console.log("\n3️⃣ Verifying all stores with this email...");
        const { rows: allStores } = await sql`
            SELECT id, name, slug, multistore_enabled, created_at
            FROM restaurants 
            WHERE email = 'multsolutionspe@gmail.com'
            ORDER BY multistore_enabled DESC, created_at ASC;
        `;

        console.log("\n📊 All stores with email multsolutionspe@gmail.com:");
        allStores.forEach((store, index) => {
            const badge = store.multistore_enabled ? "🏆 PARENT" : "📦 CHILD";
            console.log(`   ${index + 1}. ${badge} ${store.name} (${store.slug})`);
            console.log(`      - Multistore: ${store.multistore_enabled}`);
            console.log(`      - Created: ${new Date(store.created_at).toLocaleDateString()}`);
        });

        console.log("\n✅ SUCCESS! Multsolutions should now appear on https://lojaky.noviapp.com.br/");
        console.log("💡 The frontend will now show Multsolutions as the main store for this email.");

    } catch (error) {
        console.error("❌ Fix failed:", error);
    }
}

fixVisibility();
