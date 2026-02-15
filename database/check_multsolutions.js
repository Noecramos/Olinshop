const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function check() {
    try {
        console.log("Checking multsolutions store...");
        const { rows } = await sql`
            SELECT id, name, slug, email, approved, created_at, updated_at 
            FROM restaurants 
            WHERE slug = 'multsolutions'
            LIMIT 1;
        `;

        if (rows.length === 0) {
            console.log("❌ Store 'multsolutions' NOT FOUND in database");
        } else {
            console.log("✅ Store found:");
            console.log(JSON.stringify(rows[0], null, 2));

            if (rows[0].approved === false) {
                console.log("\n⚠️  ISSUE FOUND: Store is NOT APPROVED");
                console.log("This is why it's not showing on the frontend.");
                console.log("Only approved stores appear on https://lojaky.noviapp.com.br/");
            } else {
                console.log("\n✅ Store is approved");
            }
        }
    } catch (error) {
        console.error("Check failed:", error);
    }
}

check();
