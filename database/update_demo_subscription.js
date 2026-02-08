
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function updateDemo() {
    const slug = 'mtg-unissex';
    try {
        console.log(`Checking restaurant: ${slug}...`);
        const { rows } = await sql`SELECT id, name, subscription_status FROM restaurants WHERE slug = ${slug}`;

        if (rows.length === 0) {
            console.log("Restaurant not found.");
            return;
        }

        const restaurant = rows[0];
        console.log(`Found: ${restaurant.name} (ID: ${restaurant.id})`);
        console.log(`Current Status: ${restaurant.subscription_status}`);

        console.log("Updating subscription to ACTIVE...");
        await sql`
            UPDATE restaurants 
            SET 
                subscription_status = 'active',
                subscription_expires_at = NOW() + INTERVAL '1 month',
                asaas_subscription_id = 'sub_demo_active_123'
            WHERE id = ${restaurant.id}
        `;

        console.log("Update complete!");

    } catch (error) {
        console.error("Error:", error);
    }
}

updateDemo();
