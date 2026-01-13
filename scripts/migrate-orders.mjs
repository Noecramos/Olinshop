import { sql } from "@vercel/postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function migrate() {
    console.log("🚀 Starting migration...");
    try {
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS service_type VARCHAR(50) DEFAULT 'delivery'`;
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS table_number VARCHAR(50)`;
        console.log("✅ Columns added successfully!");
    } catch (e) {
        console.error("❌ Migration failed:", e);
    }
}

migrate();
