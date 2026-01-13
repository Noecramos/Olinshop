// Setup script for OlinShop database
// This creates all necessary tables in the new Postgres database

const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
    console.log('🚀 Setting up OlinShop database...\n');

    try {
        // Enable UUID extension
        console.log('📦 Enabling UUID extension...');
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        console.log('  ✅ UUID extension enabled\n');

        // Create restaurants table
        console.log('📊 Creating restaurants table...');
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
                delivery_radius DECIMAL(5, 2),
                
                delivery_fee DECIMAL(10, 2),
                delivery_fee_tiers JSONB,
                delivery_time TEXT,
                
                popular_title TEXT,
                welcome_subtitle TEXT,
                
                password TEXT,
                approved BOOLEAN DEFAULT false,
                
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('  ✅ Restaurants table created\n');

        // Create orders table
        console.log('📊 Creating orders table...');
        await sql`
            CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
                ticket_number INTEGER,
                customer_name TEXT,
                customer_phone TEXT,
                customer_address TEXT,
                customer_zip_code TEXT,
                items JSONB NOT NULL,
                subtotal DECIMAL(10, 2),
                delivery_fee DECIMAL(10, 2),
                total DECIMAL(10, 2),
                payment_method TEXT,
                change_for DECIMAL(10, 2),
                observations TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('  ✅ Orders table created\n');

        // Create products table
        console.log('📊 Creating products table...');
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
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('  ✅ Products table created\n');

        // Create categories table
        console.log('📊 Creating categories table...');
        await sql`
            CREATE TABLE IF NOT EXISTS categories (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(restaurant_id, name)
            )
        `;
        console.log('  ✅ Categories table created\n');

        // Create global_settings table
        console.log('📊 Creating global_settings table...');
        await sql`
            CREATE TABLE IF NOT EXISTS global_settings (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('  ✅ Global settings table created\n');

        // Create users table
        console.log('📊 Creating users table...');
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT,
                cpf TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;
        console.log('  ✅ Users table created\n');

        // Create restaurant_ratings table
        console.log('📊 Creating restaurant_ratings table...');
        await sql`
            CREATE TABLE IF NOT EXISTS restaurant_ratings (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(restaurant_id, user_id)
            )
        `;
        console.log('  ✅ Restaurant ratings table created\n');

        console.log('✅ Database setup completed successfully!\n');
        console.log('📝 Your OlinShop database is ready to use.');
        console.log('🔒 This database is completely isolated from Olindelivery.\n');

    } catch (error) {
        console.error('❌ Setup failed:', error);
        throw error;
    }
}

// Run setup
setupDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
