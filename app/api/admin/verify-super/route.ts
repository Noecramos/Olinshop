import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json({ error: 'Password required' }, { status: 400 });
        }

        // 1. Check DB Custom Password
        const { rows } = await sql`SELECT value FROM global_settings WHERE key = 'super_admin_password'`;
        const dbPassword = rows[0]?.value;

        // 2. Fallback to Env Var or "master"
        const masterPassword = dbPassword || process.env.SUPER_ADMIN_PASSWORD || 'master';

        console.log('Super admin login attempt');

        if (password === masterPassword) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
        }
    } catch (e) {
        console.error('Super admin verification error:', e);
        return NextResponse.json({ error: 'Erro de validação' }, { status: 500 });
    }
}
