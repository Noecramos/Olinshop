import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS subcategory TEXT`;

        return NextResponse.json({
            success: true,
            message: 'Subcategory column added successfully!'
        });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({
            error: 'Failed to run migration',
            details: error
        }, { status: 500 });
    }
}
