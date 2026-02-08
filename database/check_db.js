
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function check() {
    try {
        console.log("Checking restaurants...");
        const { rows } = await sql`
            SELECT id, name, slug, email, updated_at FROM restaurants ORDER BY updated_at DESC LIMIT 5;
        `;
        console.log("Found restaurants:");
        rows.forEach(r => console.log(`- [${r.id}] ${r.name} (${r.slug}) - ${r.email}`));
    } catch (error) {
        console.error("Check failed:", error);
    }
}

check();
