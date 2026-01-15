require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function listUsers() {
    try {
        const { rows } = await sql`SELECT name, email, created_at FROM users ORDER BY created_at DESC LIMIT 10`;
        console.log('--- OlinShop Discovery: Recent Users ---');
        console.table(rows);
        process.exit(0);
    } catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
    }
}

listUsers();
