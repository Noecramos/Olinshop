const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function verifyFrontend() {
    try {
        console.log("🔍 Simulating frontend deduplication logic...\n");

        // Get all approved stores (same query as frontend API)
        const { rows: allStores } = await sql`
            SELECT 
                id, name, slug, email, 
                multistore_enabled as "multistoreEnabled",
                created_at as "createdAt"
            FROM restaurants 
            WHERE approved = true
            ORDER BY created_at DESC
        `;

        console.log(`📊 Total approved stores: ${allStores.length}\n`);

        // Apply the same deduplication logic as frontend
        const seenEmails = new Set();
        const uniqueStores = [];

        // Sort: 1. MultistoreEnabled (Parent), 2. Oldest Created (Main Store)
        const sorted = [...allStores].sort((a, b) => {
            // Priority 1: Multistore Enabled
            const aMulti = a.multistoreEnabled === true;
            const bMulti = b.multistoreEnabled === true;
            if (aMulti && !bMulti) return -1;
            if (!aMulti && bMulti) return 1;

            // Priority 2: Creation Date (Oldest First)
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateA - dateB;
        });

        sorted.forEach(store => {
            const key = store.email || store.id;
            if (!seenEmails.has(key)) {
                seenEmails.add(key);
                uniqueStores.push(store);
            }
        });

        console.log(`✅ Stores after deduplication: ${uniqueStores.length}\n`);

        // Check if multsolutions is in the list
        const multsolutionsInList = uniqueStores.find(s => s.slug === 'multsolutions');
        const mtgUnissexInList = uniqueStores.find(s => s.slug === 'mtg-unissex');

        if (multsolutionsInList) {
            console.log("🎉 SUCCESS! Multsolutions WILL appear on the frontend!");
            console.log(`   - Name: ${multsolutionsInList.name}`);
            console.log(`   - Slug: ${multsolutionsInList.slug}`);
            console.log(`   - URL: https://lojaky.noviapp.com.br/loja/${multsolutionsInList.slug}`);
        } else {
            console.log("❌ ERROR: Multsolutions is still NOT in the frontend list!");
        }

        if (mtgUnissexInList) {
            console.log("\n⚠️  WARNING: MTG Store unissex is also showing (should be hidden)");
        } else {
            console.log("\n✅ MTG Store unissex is correctly hidden");
        }

        // Show all stores with multsolutionspe@gmail.com email
        console.log("\n📧 All stores with multsolutionspe@gmail.com:");
        const emailStores = sorted.filter(s => s.email === 'multsolutionspe@gmail.com');
        emailStores.forEach((store, i) => {
            const inFrontend = uniqueStores.find(u => u.id === store.id) ? "✅ SHOWN" : "❌ HIDDEN";
            const multistore = store.multistoreEnabled ? "🏆 PARENT" : "📦 CHILD";
            console.log(`   ${i + 1}. ${inFrontend} ${multistore} ${store.name} (${store.slug})`);
        });

    } catch (error) {
        console.error("❌ Verification failed:", error);
    }
}

verifyFrontend();
