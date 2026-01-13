
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "O email é obrigatório" }, { status: 400 });
        }

        // 1. Find user
        const { rows } = await sql`SELECT id, name, phone, whatsapp FROM users WHERE email = ${email}`;

        if (rows.length === 0) {
            return NextResponse.json({ error: "Usuário não encontrado com este email" }, { status: 404 });
        }

        const user = rows[0];

        // 2. Generate random 6-digit numeric password
        const newPassword = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await hashPassword(newPassword);

        // 3. Update database
        await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${user.id}`;

        // 4. Determine destination phone and fix formatting
        let destPhone = (user.whatsapp || user.phone || "").toString().replace(/\D/g, '');

        // Remove leading zero if present (common in Brazil like 081...)
        if (destPhone.startsWith('0')) {
            destPhone = destPhone.substring(1);
        }

        // If it looks like a BR number without country code (10 or 11 digits)
        if (destPhone.length >= 10 && destPhone.length <= 11 && !destPhone.startsWith('55')) {
            destPhone = '55' + destPhone;
        }

        // Ensure some country code is present if not already (safeguard)
        if (destPhone.length > 0 && !destPhone.startsWith('55') && destPhone.length <= 11) {
            // Default to 55 for this app's main market
            destPhone = '55' + destPhone;
        }

        return NextResponse.json({
            success: true,
            message: "Senha resetada com sucesso",
            phone: destPhone,
            newPassword: newPassword,
            userName: user.name
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 });
    }
}
