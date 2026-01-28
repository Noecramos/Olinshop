
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function check() {
    try {
        const { rows } = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'products';
        `;
        console.log("Columns in 'products' table:");
        rows.forEach(r => console.log(`- ${r.column_name}: ${r.data_type}`));
    } catch (error) {
        console.error("Check failed:", error);
    }
}

check();
