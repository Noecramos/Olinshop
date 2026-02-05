const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function forceHours() {
    console.log('🔧 FORCE UPDATING BOOKING HOURS...\n');

    // Default to 24 hours open for testing
    const fullDay = ["00:00-23:59"];
    const newHours = {
        monday: fullDay, tuesday: fullDay, wednesday: fullDay,
        thursday: fullDay, friday: fullDay, saturday: fullDay, sunday: fullDay
    };

    console.log('   Setting Kroff Pet Center (1e8d...) to 24/7...');
    const result = await sql`
        UPDATE restaurants 
        SET booking_hours = ${JSON.stringify(newHours)}, booking_cancellation_hours = 0
        WHERE id = '1e8cfe48-40d0-4a74-ba85-8408373715cb'
        RETURNING id, name, booking_hours, booking_cancellation_hours
    `;

    if (result.rows.length > 0) {
        console.log('✅ Updated:', result.rows[0].name);
        console.log('   Cancellation Hours: 0 (Immediate for testing)');
        console.log('   Hours:', JSON.stringify(result.rows[0].booking_hours));
    } else {
        console.log('❌ Store not found!');
    }
}

forceHours().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
