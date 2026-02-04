import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Update all image paths to use local files
        const updates = {
            headerImage: '/logo-lojaky.png',
            splashImage: '/splash-lojaky.jpg',
            headerBackgroundImage: '/header-lojaky.png',
            headerBackgroundType: 'image'
        };

        for (const [key, value] of Object.entries(updates)) {
            await sql`
                INSERT INTO global_settings (key, value)
                VALUES (${key}, ${value})
                ON CONFLICT (key) DO UPDATE SET value = ${value}
            `;
        }

        return NextResponse.json({
            success: true,
            message: 'All images updated successfully!',
            updates: updates
        });
    } catch (error: any) {
        console.error('Update Images Error:', error);
        return NextResponse.json({
            error: 'Failed to update images',
            details: error.message
        }, { status: 500 });
    }
}
