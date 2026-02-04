import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        console.log('🔧 Force updating LojaKy configuration...');

        const updates = {
            headerImage: '/logo-lojaky.png',
            splashImage: '/splash-lojaky.jpg',
            headerBackgroundImage: '/header-lojaky.png',
            headerBackgroundType: 'image',
            footerText: '© Noviapp Mobile Apps • LojAky®',
            headerBgColor: '#C8C4E9',
            welcomeSubtitle: 'Suas compra na LojAky'
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
            message: 'LojaKy configuration updated successfully!',
            updates: updates
        });
    } catch (error: any) {
        console.error('Update error:', error);
        return NextResponse.json({
            error: 'Failed to update configuration',
            details: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    return POST();
}
