require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function initializeDatabase() {
    console.log('🚀 Starting Database Initialization for OlinShop (Isolated)...\n');

    try {
        // Enable UUID extension
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // 1. Restaurants (Stores) Table
        console.log('⏳ Creating restaurants table...');
        await sql`
            CREATE TABLE IF NOT EXISTS restaurants (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                responsible_name TEXT,
                email TEXT,
                whatsapp TEXT,
                instagram TEXT,
                zip_code TEXT,
                address TEXT,
                hours TEXT,
                type TEXT,
                image TEXT,
                pix_key TEXT,
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                delivery_radius DECIMAL(10, 2),
                delivery_fee DECIMAL(10, 2),
                delivery_fee_tiers JSONB,
                delivery_time TEXT,
                popular_title TEXT,
                welcome_subtitle TEXT,
                password TEXT,
                approved BOOLEAN DEFAULT false,
                is_open BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;

        // 2. Users Table
        console.log('⏳ Creating users table...');
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT,
                whatsapp TEXT,
                zip_code TEXT,
                address TEXT,
                cpf TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;

        // 3. Orders Table (Comprehensive version including recent fields)
        console.log('⏳ Creating orders table...');
        await sql`
            CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
                ticket_number INTEGER,
                customer_name TEXT NOT NULL,
                customer_phone TEXT NOT NULL,
                customer_address TEXT NOT NULL,
                customer_zip_code TEXT,
                customer_email TEXT,
                customer_cpf TEXT,
                items JSONB NOT NULL,
                subtotal DECIMAL(10, 2) NOT NULL,
                delivery_fee DECIMAL(10, 2) DEFAULT 0,
                total DECIMAL(10, 2) NOT NULL,
                payment_method TEXT,
                change_for DECIMAL(10, 2),
                observations TEXT,
                status TEXT DEFAULT 'pending',
                service_type TEXT,
                table_number TEXT,
                shipping_method TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;

        // 4. Products Table
        console.log('⏳ Creating products table...');
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                category TEXT,
                image TEXT,
                description TEXT,
                variants JSONB,
                available BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;

        // 5. Categories Table
        console.log('⏳ Creating categories table...');
        await sql`
            CREATE TABLE IF NOT EXISTS categories (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(restaurant_id, name)
            )
        `;

        // 6. Global Settings (for Super Admin etc)
        console.log('⏳ Creating global_settings table...');
        await sql`
            CREATE TABLE IF NOT EXISTS global_settings (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;

        // 7. Indexes
        console.log('⏳ Creating indexes...');
        await sql`CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_products_restaurant_id ON products(restaurant_id)`;

        console.log('\n✅ Database Isolated Initialization Complete!');
        process.exit(0);
    } catch (e) {
        console.error('\n❌ Initialization Failed:', e.message);
        process.exit(1);
    }
}

initializeDatabase();
