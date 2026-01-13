import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { rows: tableInfo } = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'orders'
        `;

        const { rows: totalOrders } = await sql`SELECT count(*) FROM orders`;
        const { rows: statusCounts } = await sql`SELECT status, count(*) FROM orders GROUP BY status`;

        return NextResponse.json({
            schema: tableInfo,
            total_orders: totalOrders[0].count,
            status_summary: statusCounts
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
