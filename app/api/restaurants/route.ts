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
            const { rows } = await sql`
                SELECT *, 
                pix_key as "pixKey", 
                zip_code as "zipCode", 
                responsible_name as "responsibleName",
                delivery_radius as "deliveryRadius",
                delivery_fee_tiers as "deliveryFeeTiers"
                FROM restaurants WHERE id = ${id}
            `;
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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Registration request body:', JSON.stringify(body, null, 2));

        let { name, slug, responsibleName, email, whatsapp, address, zipCode, image, hours, type, instagram, pixKey } = body;

        // Detailed validation with specific error messages
        if (!name) {
            console.error('Validation failed: name is missing');
            return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
        }

        if (!slug) {
            console.error('Validation failed: slug is missing');
            return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 });
        }

        // Check for duplicate slug and auto-generate unique one if needed
        let finalSlug = slug;
        let slugExists = await sql`SELECT id FROM restaurants WHERE slug = ${finalSlug}`;

        if (slugExists.rows.length > 0) {
            console.log('Slug already exists, generating unique slug...');
            let counter = 1;
            let uniqueSlugFound = false;

            while (!uniqueSlugFound && counter < 100) {
                finalSlug = `${slug}-${counter}`;
                slugExists = await sql`SELECT id FROM restaurants WHERE slug = ${finalSlug}`;

                if (slugExists.rows.length === 0) {
                    uniqueSlugFound = true;
                    console.log('Generated unique slug:', finalSlug);
                } else {
                    counter++;
                }
            }

            if (!uniqueSlugFound) {
                console.error('Could not generate unique slug after 100 attempts');
                return NextResponse.json({ error: 'Não foi possível gerar um link único. Tente outro nome.' }, { status: 409 });
            }
        }

        // Insert with proper null handling
        await sql`
            INSERT INTO restaurants (
                name, slug, responsible_name, email, whatsapp, address, zip_code, image, hours, type, instagram, pix_key, approved, created_at
            ) VALUES (
                ${name}, 
                ${finalSlug}, 
                ${responsibleName || null}, 
                ${email || null}, 
                ${whatsapp || null}, 
                ${address || null}, 
                ${zipCode || null}, 
                ${image || null}, 
                ${hours || null}, 
                ${type || null}, 
                ${instagram || null}, 
                ${pixKey || null}, 
                false, 
                NOW()
            )
        `;

        console.log('Restaurant registered successfully with slug:', finalSlug);
        return NextResponse.json({
            success: true,
            message: 'Cadastro realizado com sucesso!',
            slug: finalSlug
        });

    } catch (error: any) {
        console.error('Registration Error:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json({
            error: error.message || 'Erro ao processar cadastro',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
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

        // Manual cleanup (in case referencing constraints lack ON DELETE CASCADE)
        await sql`DELETE FROM products WHERE restaurant_id = ${id}`;
        await sql`DELETE FROM categories WHERE restaurant_id = ${id}`;
        await sql`DELETE FROM orders WHERE restaurant_id = ${id}`;

        // Delete restaurant
        await sql`DELETE FROM restaurants WHERE id = ${id}`;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
