import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const allStores = await sql`SELECT count(*) FROM restaurants`;
        const approvedStores = await sql`SELECT count(*) FROM restaurants WHERE approved = true`;
        const openStores = await sql`SELECT count(*) FROM restaurants WHERE is_open = true`;

        let sample;
        let ratingColumnsExist = false;
        try {
            // Try to select rating columns
            sample = await sql`SELECT id, name, slug, approved, is_open, rating_sum, rating_count FROM restaurants LIMIT 5`;
            ratingColumnsExist = true;
        } catch (e) {
            // If fails, select without them to confirm basic select works
            sample = await sql`SELECT id, name, slug, approved, is_open FROM restaurants LIMIT 5`;
        }

        return NextResponse.json({
            total: allStores.rows[0].count,
            approved: approvedStores.rows[0].count,
            open: openStores.rows[0].count,
            ratingColumnsExist,
            sample: sample.rows,
            env: process.env.POSTGRES_URL ? 'Set' : 'Missing'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
