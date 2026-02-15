const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function fixDatabase() {
    try {
        console.log("🔧 Fixing database for proper multistore setup...\n");

        // 1. MTG Store unissex should be the master (multistore enabled)
        console.log("1️⃣ Setting MTG Store unissex as master...");
        const { rows: mtgUnissex } = await sql`
            UPDATE restaurants 
            SET multistore_enabled = true, updated_at = NOW()
            WHERE slug = 'mtg-unissex'
            RETURNING id, name, slug, email, type, multistore_enabled, created_at;
        `;

        if (mtgUnissex.length > 0) {
            console.log("✅ MTG Store unissex:");
            console.log(`   - Multistore: ${mtgUnissex[0].multistore_enabled}`);
            console.log(`   - Email: ${mtgUnissex[0].email}`);
            console.log(`   - Type: ${mtgUnissex[0].type}`);
        }

        // 2. MTG FEM Peixinhos should be a child (multistore disabled)
        console.log("\n2️⃣ Setting MTG FEM Peixinhos as child...");
        const { rows: mtgFem } = await sql`
            UPDATE restaurants 
            SET multistore_enabled = false, updated_at = NOW()
            WHERE slug = 'mtg-peixinhos-y50s'
            RETURNING id, name, slug, email, type, multistore_enabled;
        `;

        if (mtgFem.length > 0) {
            console.log("✅ MTG FEM Peixinhos:");
            console.log(`   - Multistore: ${mtgFem[0].multistore_enabled}`);
            console.log(`   - Email: ${mtgFem[0].email}`);
            console.log(`   - Type: ${mtgFem[0].type}`);
        }

        // 3. Multsolutions should be separate (multistore enabled for itself)
        console.log("\n3️⃣ Setting Multsolutions as separate store...");
        const { rows: multsolutions } = await sql`
            UPDATE restaurants 
            SET multistore_enabled = false, updated_at = NOW()
            WHERE slug = 'multsolutions'
            RETURNING id, name, slug, email, type, multistore_enabled;
        `;

        if (multsolutions.length > 0) {
            console.log("✅ Multsolutions:");
            console.log(`   - Multistore: ${multsolutions[0].multistore_enabled}`);
            console.log(`   - Email: ${multsolutions[0].email}`);
            console.log(`   - Type: ${multsolutions[0].type}`);
        }

        // 4. Verify final state
        console.log("\n📊 Final state of all stores with multsolutionspe@gmail.com:");
        const { rows: allStores } = await sql`
            SELECT name, slug, email, type, multistore_enabled, created_at
            FROM restaurants 
            WHERE email = 'multsolutionspe@gmail.com'
            ORDER BY type ASC, multistore_enabled DESC, created_at ASC;
        `;

        const groups = new Map();
        allStores.forEach(store => {
            const key = `${store.email}|${store.type}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(store);
        });

        console.log("\n📦 Grouped by Email + Type:");
        let groupNum = 1;
        groups.forEach((stores, key) => {
            const [email, type] = key.split('|');
            console.log(`\n   Group ${groupNum} (${type}):`);
            stores.forEach((store, idx) => {
                const badge = store.multistore_enabled ? "🏆 MASTER (shows on frontend)" : "📦 CHILD (hidden, accessible via selector)";
                console.log(`      ${idx + 1}. ${badge}`);
                console.log(`         - Name: ${store.name}`);
                console.log(`         - Slug: ${store.slug}`);
                console.log(`         - Created: ${new Date(store.created_at).toLocaleDateString()}`);
            });
            groupNum++;
        });

        console.log("\n✅ SUCCESS!");
        console.log("\n🎯 Expected frontend behavior:");
        console.log("   1. Homepage shows: Multsolutions (Loja) + MTG Store unissex (Moda)");
        console.log("   2. Clicking Multsolutions → Goes directly to store page (no siblings)");
        console.log("   3. Clicking MTG Store unissex → Location selector with 2 options:");
        console.log("      - MTG Store unissex (Águas Compridas)");
        console.log("      - MTG FEM Peixinhos (Bairro Novo)");

    } catch (error) {
        console.error("❌ Fix failed:", error);
    }
}

fixDatabase();
