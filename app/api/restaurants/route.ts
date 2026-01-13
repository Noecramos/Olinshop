import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const all = searchParams.get('all');
        const id = searchParams.get('id');

        // Delete check moved to DELETE method below, but sometimes passed as query param in older implementations.
        // We will implement standard REST methods.

        if (id) {
            const { rows } = await sql`SELECT * FROM restaurants WHERE id = ${id}`;
            return NextResponse.json(rows[0] || {});
        }

        if (all === 'true') {
            const { rows } = await sql`SELECT * FROM restaurants ORDER BY created_at DESC`;
            return NextResponse.json(rows);
        }

        // Default: get active restaurants for main page (if needed)
        const { rows } = await sql`SELECT * FROM restaurants WHERE approved = true`;
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, approved, resetPassword } = body;

        if (resetPassword) {
            const newPassword = Math.random().toString(36).slice(-8);
            await sql`UPDATE restaurants SET password = ${newPassword} WHERE id = ${id}`;
            return NextResponse.json({ password: newPassword });
        }

        if (approved !== undefined) {
            // Generate password if approving and no password exists
            let password = undefined;
            if (approved) {
                const { rows } = await sql`SELECT password FROM restaurants WHERE id = ${id}`;
                if (!rows[0]?.password) {
                    password = Math.random().toString(36).slice(-8);
                    await sql`UPDATE restaurants SET approved = ${approved}, password = ${password} WHERE id = ${id}`;
                } else {
                    await sql`UPDATE restaurants SET approved = ${approved} WHERE id = ${id}`;
                    password = rows[0].password;
                }
            } else {
                await sql`UPDATE restaurants SET approved = ${approved} WHERE id = ${id}`;
            }
            return NextResponse.json({ success: true, password });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await sql`DELETE FROM restaurants WHERE id = ${id}`;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
