const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function checkHours() {
    console.log('🕒 Checking Booking Hours for Kroff Pet Center...');
    const result = await sql`
        SELECT id, name, booking_hours, booking_enabled, booking_duration 
        FROM restaurants 
        WHERE id = '1e8cfe48-40d0-4a74-ba85-8408373715cb'
    `;

    if (result.rows.length > 0) {
        const r = result.rows[0];
        console.log('   Store:', r.name);
        console.log('   Enabled:', r.booking_enabled);
        console.log('   Duration:', r.booking_duration);
        console.log('   Hours:', JSON.stringify(r.booking_hours, null, 2));

        // Validation
        if (!r.booking_hours) {
            console.log('⚠️ Booking hours are NULL or EMPTY!');
            // Apply Fix
            console.log('🔧 Applying default 24h hours for testing...');
            const fullDay = ["00:00-23:59"];
            const newHours = {
                monday: fullDay, tuesday: fullDay, wednesday: fullDay,
                thursday: fullDay, friday: fullDay, saturday: fullDay, sunday: fullDay
            };
            await sql`
                UPDATE restaurants 
                SET booking_hours = ${JSON.stringify(newHours)} 
                WHERE id = ${r.id}
            `;
            console.log('✅ Updated to 24/7 hours for testing.');
        } else {
            console.log('✅ Hours exist.');
        }
    } else {
        console.log('❌ Store not found');
    }
}

checkHours().then(() => process.exit(0)).catch(e => console.error(e));
