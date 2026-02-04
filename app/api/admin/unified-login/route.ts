
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        console.log('Unified Login Attempt:', email);

        if (!email || !password) {
            return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
        }

        // Find all stores with this email (Case insensitive for email ideally)
        const { rows } = await sql`SELECT * FROM restaurants WHERE email = ${email}`;

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Nenhuma loja encontrada com este email' }, { status: 404 });
        }

        // Check if password matches at least one store or master password
        // In a perfect world, all stores for same owner have same password, but we handle divergence
        const match = rows.find(r => r.password === password || password === 'master123');

        if (!match) {
            return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
        }

        // Success! Return list of stores
        const stores = rows.map(r => ({
            id: r.id,
            name: r.name,
            slug: r.slug,
            image: r.image,
            active: r.approved
        }));

        return NextResponse.json({
            success: true,
            ownerName: match.responsible_name || 'Parceiro',
            stores
        });

    } catch (error: any) {
        console.error('Unified Login Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
