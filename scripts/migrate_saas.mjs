
import { sql } from "@vercel/postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function migrate() {
  try {
    console.log("Starting SaaS Migration...");

    // 1. Create saas_plans table
    console.log("Creating saas_plans table...");
    await sql`
      CREATE TABLE IF NOT EXISTS saas_plans (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        duration_months INTEGER NOT NULL,
        discount_percent INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // 2. Insert default plans if empty
    const { rows: plans } = await sql`SELECT count(*) FROM saas_plans`;
    if (parseInt(plans[0].count) === 0) {
      console.log("Seeding default plans...");
      await sql`
        INSERT INTO saas_plans (name, duration_months, discount_percent) VALUES
        ('Mensal', 1, 0),
        ('Trimestral', 3, 5),
        ('Semestral', 6, 10),
        ('Anual', 12, 20);
      `;
    }

    // 3. Update restaurants table
    console.log("Updating restaurants table...");
    
    // Check if columns exist to avoid errors (simplified approach: just add if not exists implies specific checks, 
    // but in postgres 'ADD COLUMN IF NOT EXISTS' is valid in recent versions, otherwise we catch errors)
    
    await sql`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT`;
    await sql`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS asaas_subscription_id TEXT`;
    await sql`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active'`; 
    // status: 'active', 'inactive', 'overdue', 'trial'
    await sql`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP`;
    await sql`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT false`;

    // 4. Create payments table
    console.log("Creating payments table...");
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        restaurant_id UUID REFERENCES restaurants(id),
        asaas_payment_id TEXT,
        amount DECIMAL(10, 2),
        status TEXT,
        payment_method TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // 5. Global Settings for Base Price and Grace Period
    console.log("Setting default global settings...");
    await sql`
        INSERT INTO global_settings (key, value)
        VALUES 
            ('saas_base_price', '49.90'),
            ('saas_grace_period_days', '3'),
            ('saas_trial_days', '7')
        ON CONFLICT (key) DO NOTHING;
    `;

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrate();
