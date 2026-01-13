
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        // Simple security check (could be improved with real super admin auth)
        const { rows } = await sql`
            SELECT id, name, email, phone, whatsapp, zip_code as "zipCode", address, cpf, created_at as "createdAt"
            FROM users 
            ORDER BY created_at DESC
        `;
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, resetPassword } = body;

        if (resetPassword) {
            const newPassword = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedPassword = await hashPassword(newPassword);
            await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${id}`;
            return NextResponse.json({ success: true, newPassword });
        }

        return NextResponse.json({ error: "Ação não informada" }, { status: 400 });
    } catch (error) {
        console.error("Update User Error:", error);
        return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
        }

        await sql`DELETE FROM users WHERE id = ${id}`;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete User Error:", error);
        return NextResponse.json({ error: "Erro ao excluir usuário" }, { status: 500 });
    }
}
