// Add booking system columns to restaurants and products tables
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function addBookingColumns() {
    console.log('🔧 Adding booking system columns...\n');

    try {
        // 1. Add booking columns to restaurants table
        console.log('📊 Updating restaurants table...');
        await sql`
            ALTER TABLE restaurants 
            ADD COLUMN IF NOT EXISTS booking_enabled BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS booking_mode VARCHAR(50) DEFAULT 'disabled',
            ADD COLUMN IF NOT EXISTS booking_duration INTEGER DEFAULT 30,
            ADD COLUMN IF NOT EXISTS booking_hours JSONB DEFAULT '{"monday":["09:00-18:00"],"tuesday":["09:00-18:00"],"wednesday":["09:00-18:00"],"thursday":["09:00-18:00"],"friday":["09:00-18:00"],"saturday":["09:00-14:00"],"sunday":[]}'::jsonb,
            ADD COLUMN IF NOT EXISTS booking_interval INTEGER DEFAULT 30,
            ADD COLUMN IF NOT EXISTS booking_deposit_percent INTEGER DEFAULT 50,
            ADD COLUMN IF NOT EXISTS booking_cancellation_hours INTEGER DEFAULT 2
        `;
        console.log('✅ Restaurants table updated\n');

        // 2. Add service columns to products table
        console.log('📦 Updating products table...');
        await sql`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS is_service BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS requires_booking BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS service_duration INTEGER DEFAULT 30
        `;
        console.log('✅ Products table updated\n');

        // 3. Create bookings table
        console.log('📅 Creating bookings table...');
        await sql`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
                customer_name VARCHAR(255) NOT NULL,
                customer_phone VARCHAR(50) NOT NULL,
                customer_email VARCHAR(255),
                booking_date DATE NOT NULL,
                booking_time TIME NOT NULL,
                duration INTEGER DEFAULT 30,
                total_price DECIMAL(10,2) DEFAULT 0,
                deposit_amount DECIMAL(10,2) DEFAULT 0,
                payment_status VARCHAR(50) DEFAULT 'pending',
                pix_code TEXT,
                notes TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                cancelled_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('✅ Bookings table created\n');

        // 4. Create booking_items table (for multiple services)
        console.log('🛍️ Creating booking_items table...');
        await sql`
            CREATE TABLE IF NOT EXISTS booking_items (
                id SERIAL PRIMARY KEY,
                booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
                product_id UUID REFERENCES products(id) ON DELETE CASCADE,
                product_name VARCHAR(255) NOT NULL,
                product_price DECIMAL(10,2) NOT NULL,
                quantity INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('✅ Booking items table created\n');

        // 5. Set smart defaults based on business type
        console.log('🎯 Setting smart defaults by segment...');

        const segments = [
            { type: 'Barbearia', enabled: true, mode: 'always', duration: 30 },
            { type: 'Salão de Beleza', enabled: true, mode: 'always', duration: 60 },
            { type: 'Pet Shop', enabled: true, mode: 'product_based', duration: 60 },
            { type: 'Academia', enabled: true, mode: 'always', duration: 60 },
            { type: 'Clínica', enabled: true, mode: 'always', duration: 30 },
            { type: 'Consultório', enabled: true, mode: 'always', duration: 30 }
        ];

        for (const segment of segments) {
            await sql`
                UPDATE restaurants 
                SET 
                    booking_enabled = ${segment.enabled},
                    booking_mode = ${segment.mode},
                    booking_duration = ${segment.duration}
                WHERE type = ${segment.type}
                AND booking_enabled = false
            `;
            console.log(`   ✓ ${segment.type}: booking_mode=${segment.mode}`);
        }

        console.log('\n✅ Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

addBookingColumns()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
