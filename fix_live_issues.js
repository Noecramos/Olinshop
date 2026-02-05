const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function runFix() {
    console.log('🔧 RUNNING FIXES...\n');

    // 1. Fix "Tosa" and Services - mark as booking
    console.log('✂️ Updating service products (is_service=true, requires_booking=true)...');
    const serviceKeywords = ['%Tosa%', '%Banho%', '%Corte%', '%Barba%', '%Sessão%', '%Consulta%'];

    for (const keyword of serviceKeywords) {
        // Also update tracking stock to false, as services don't have stock
        const result = await sql`
            UPDATE products 
            SET is_service = true, requires_booking = true, service_duration = 60, track_stock = false
            WHERE name ILIKE ${keyword}
            RETURNING id, name, restaurant_id
        `;
        if (result.rowCount > 0) {
            console.log(`   ✅ Marked as Service: ${result.rows.map(r => r.name).join(', ')} (Stores: ${result.rows.map(r => r.restaurant_id).join(',')})`);
        } else {
            // console.log(`   🔸 No products found for "${keyword}"`);
        }
    }

    // 2. Force Close Kroff Pet Center (1e8cfe48...)
    console.log('\n🔒 Closing Kroff Pet Center...');
    const closeResult = await sql`
        UPDATE restaurants 
        SET is_open = false, booking_enabled = true, booking_mode = 'product_based'
        WHERE id = '1e8cfe48-40d0-4a74-ba85-8408373715cb'
        RETURNING id, name, is_open, booking_enabled, booking_mode
    `;
    console.log('   Store Status Updated:', closeResult.rows[0]);

    // 3. Create Test Service if Tosa missing
    const checkTosa = await sql`SELECT id FROM products WHERE name ILIKE '%Tosa%' AND restaurant_id = '1e8cfe48-40d0-4a74-ba85-8408373715cb'`;
    if (checkTosa.rowCount === 0) {
        console.log('\n⚠️ "Tosa" product not found for Kroff. Creating "Tosa Teste"...');
        const inserted = await sql`
            INSERT INTO products (
                restaurant_id, name, price, category, description, 
                is_service, requires_booking, service_duration, 
                track_stock, stock_quantity, image
            ) VALUES (
                '1e8cfe48-40d0-4a74-ba85-8408373715cb', 'Tosa Teste', 50.00, 'Serviços', 'Banho e Tosa completo (Teste)',
                true, true, 60, false, 0, null
            ) RETURNING id, name
        `;
        console.log('   ✅ Created:', inserted.rows[0]);
    } else {
        console.log('\n✅ "Tosa" exists for Kroff.');
    }

    console.log('\n✅ Fixes completed.');
}

runFix().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
