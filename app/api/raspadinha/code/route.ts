import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

function generateSecureCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function GET() {
    try {
        const { rows } = await sql`SELECT value FROM global_settings WHERE key = 'raspadinha_code'`;
        let currentCode = rows[0]?.value;

        if (!currentCode) {
            currentCode = generateSecureCode();
            await sql`
                INSERT INTO global_settings (key, value)
                VALUES ('raspadinha_code', ${currentCode})
                ON CONFLICT (key) DO UPDATE SET value = ${currentCode}
            `;
        }

        return NextResponse.json({ code: currentCode });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
