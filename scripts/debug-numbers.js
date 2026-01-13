
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function check() {
    try {
        const u = await sql`SELECT name, whatsapp, phone FROM users ORDER BY created_at DESC LIMIT 5`;
        const r = await sql`SELECT name, whatsapp FROM restaurants ORDER BY created_at DESC LIMIT 5`;
        console.log('--- USERS ---');
        console.table(u.rows);
        console.log('--- RESTAURANTS ---');
        console.table(r.rows);
    } catch (e) {
        console.error(e);
    }
}
check();
