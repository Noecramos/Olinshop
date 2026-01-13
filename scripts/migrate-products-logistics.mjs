import { sql } from "@vercel/postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function migrate() {
    try {
        console.log("🚀 Starting products table migration...");

        await sql`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS weight FLOAT DEFAULT 0.5,
            ADD COLUMN IF NOT EXISTS height FLOAT DEFAULT 15,
            ADD COLUMN IF NOT EXISTS width FLOAT DEFAULT 15,
            ADD COLUMN IF NOT EXISTS length FLOAT DEFAULT 15;
        `;

        console.log("✅ Products table updated successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    }
}

migrate();
