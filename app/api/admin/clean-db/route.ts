import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');
        const secret = searchParams.get('secret');

        // Simple security check
        if (secret !== 'clean-db-2026') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (action === 'list') {
            // List all restaurants
            const { rows } = await sql`
                SELECT id, name, slug, created_at, approved 
                FROM restaurants 
                ORDER BY created_at DESC 
                LIMIT 20
            `;
            return NextResponse.json({ restaurants: rows });
        }

        if (action === 'duplicates') {
            // Find duplicates
            const { rows } = await sql`
                SELECT slug, COUNT(*) as count 
                FROM restaurants 
                GROUP BY slug 
                HAVING COUNT(*) > 1
            `;
            return NextResponse.json({ duplicates: rows });
        }

        if (action === 'clean') {
            // Delete unapproved duplicates
            const duplicates = await sql`
                SELECT slug, COUNT(*) as count 
                FROM restaurants 
                GROUP BY slug 
                HAVING COUNT(*) > 1
            `;

            const results = [];
            for (const dup of duplicates.rows) {
                const deleted = await sql`
                    DELETE FROM restaurants 
                    WHERE slug = ${dup.slug} 
                    AND approved = false 
                    AND id NOT IN (
                        SELECT id FROM restaurants 
                        WHERE slug = ${dup.slug} 
                        ORDER BY created_at DESC 
                        LIMIT 1
                    )
                    RETURNING id, name, slug
                `;
                results.push({
                    slug: dup.slug,
                    deleted: deleted.rows
                });
            }

            return NextResponse.json({
                message: 'Cleanup completed',
                results
            });
        }

        return NextResponse.json({
            message: 'Use ?action=list|duplicates|clean&secret=clean-db-2026'
        });

    } catch (error: any) {
        console.error('Database Error:', error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}
