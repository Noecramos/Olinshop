import { sql } from "@vercel/postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function migrate() {
    try {
        console.log("🚀 Starting orders table update (shipping_method)...");

        await sql`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS shipping_method TEXT;
        `;

        console.log("✅ Orders table updated successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    }
}

migrate();
