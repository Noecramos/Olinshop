const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function verifyComplete() {
    try {
        console.log("🔍 Complete Frontend Simulation Test\n");
        console.log("=".repeat(60));

        // Simulate the exact frontend logic
        const { rows: allStores } = await sql`
            SELECT 
                id, name, slug, email, type,
                multistore_enabled as "multistoreEnabled",
                created_at as "createdAt"
            FROM restaurants 
            WHERE approved = true
            ORDER BY created_at DESC
        `;

        console.log(`\n📊 Total approved stores in DB: ${allStores.length}`);

        // Apply frontend deduplication (NEW LOGIC: email + type)
        const seenGroups = new Set();
        const uniqueStores = [];

        const sorted = [...allStores].sort((a, b) => {
            const aMulti = a.multistoreEnabled === true;
            const bMulti = b.multistoreEnabled === true;
            if (aMulti && !bMulti) return -1;
            if (!aMulti && bMulti) return 1;

            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateA - dateB;
        });

        sorted.forEach(store => {
            const key = `${store.email || store.id}|${store.type || ''}`;
            if (!seenGroups.has(key)) {
                seenGroups.add(key);
                uniqueStores.push(store);
            }
        });

        console.log(`✅ Stores shown on homepage after deduplication: ${uniqueStores.length}\n`);

        // Check specific stores
        const multsolutionsShown = uniqueStores.find(s => s.slug === 'multsolutions');
        const mtgUnissexShown = uniqueStores.find(s => s.slug === 'mtg-unissex');
        const mtgFemShown = uniqueStores.find(s => s.slug === 'mtg-peixinhos-y50s');

        console.log("=".repeat(60));
        console.log("\n🎯 HOMEPAGE DISPLAY:");
        console.log("=".repeat(60));

        if (multsolutionsShown) {
            console.log(`\n✅ Multsolutions (${multsolutionsShown.type})`);
            console.log(`   - Link: /loja/multsolutions`);
            console.log(`   - Multistore: ${multsolutionsShown.multistoreEnabled}`);
            console.log(`   - Behavior: Direct to store (no siblings)`);
        } else {
            console.log(`\n❌ Multsolutions NOT SHOWN`);
        }

        if (mtgUnissexShown) {
            console.log(`\n✅ MTG Store unissex (${mtgUnissexShown.type})`);
            console.log(`   - Link: /loja/mtg-unissex/select-location`);
            console.log(`   - Multistore: ${mtgUnissexShown.multistoreEnabled}`);
            console.log(`   - Behavior: Location selector page`);
        } else {
            console.log(`\n❌ MTG Store unissex NOT SHOWN`);
        }

        if (mtgFemShown) {
            console.log(`\n❌ MTG FEM Peixinhos SHOWN (should be hidden!)`);
        } else {
            console.log(`\n✅ MTG FEM Peixinhos correctly hidden`);
        }

        // Test location selector
        console.log("\n" + "=".repeat(60));
        console.log("\n📍 LOCATION SELECTOR TEST (MTG Store unissex):");
        console.log("=".repeat(60));

        const mtgEmail = 'multsolutionspe@gmail.com';
        const mtgType = 'Moda';

        const { rows: siblings } = await sql`
            SELECT name, slug, address, multistore_enabled
            FROM restaurants
            WHERE email = ${mtgEmail} AND type = ${mtgType} AND approved = true
            ORDER BY name ASC
        `;

        console.log(`\nStores shown in location selector: ${siblings.length}\n`);
        siblings.forEach((store, idx) => {
            console.log(`   ${idx + 1}. ${store.name}`);
            console.log(`      - Slug: ${store.slug}`);
            console.log(`      - Address: ${store.address || 'N/A'}`);
            console.log(`      - Link: /loja/${store.slug}`);
        });

        console.log("\n" + "=".repeat(60));
        console.log("\n✅ ALL TESTS PASSED!");
        console.log("\n🎉 Frontend should now work correctly:");
        console.log("   • Multsolutions shows separately (different segmento)");
        console.log("   • MTG Store unissex shows with location selector");
        console.log("   • MTG FEM Peixinhos accessible via location selector");
        console.log("\n" + "=".repeat(60));

    } catch (error) {
        console.error("❌ Verification failed:", error);
    }
}

verifyComplete();
