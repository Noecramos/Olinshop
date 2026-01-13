
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function fix() {
    try {
        // Fix the specific user reported
        const res = await sql`UPDATE users SET phone = '81 99551-5777' WHERE email = 'noecramos@gmail.com'`;
        console.log('Update result:', res.rowCount);

        // Check if there are other similar errors
        const users = await sql`SELECT id, name, phone FROM users WHERE length(replace(phone, ' ', '')) > 11`;
        console.log('Other users with long phones:', users.rows);
    } catch (e) {
        console.error(e);
    }
}
fix();
