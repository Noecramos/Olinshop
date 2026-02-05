import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
    try {
        await sql`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS is_sold_by_weight BOOLEAN DEFAULT FALSE;
        `;

        // Attempt to alter stock_quantity to numeric (if not already)
        // This might fail if dependent objects exist, but usually safe for simple table
        await sql`
            ALTER TABLE products 
            ALTER COLUMN stock_quantity TYPE NUMERIC USING stock_quantity::numeric;
        `;

        return NextResponse.json({ success: true, message: "Products table updated: is_sold_by_weight added, stock_quantity converted to NUMERIC" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
