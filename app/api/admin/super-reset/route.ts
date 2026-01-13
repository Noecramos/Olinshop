import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
    try {
        // Generate new password (uppercase logic for easier reading)
        const newPassword = Math.random().toString(36).slice(-8).toUpperCase();

        // Save to DB
        const check = await sql`SELECT key FROM global_settings WHERE key = 'super_admin_password'`;
        if (check.rows.length === 0) {
            await sql`INSERT INTO global_settings (key, value) VALUES ('super_admin_password', ${newPassword})`;
        } else {
            await sql`UPDATE global_settings SET value = ${newPassword} WHERE key = 'super_admin_password'`;
        }

        return NextResponse.json({
            success: true,
            message: 'Senha resetada com sucesso. ATENÇÃO: Como o serviço de e-mail não está configurado, salve a senha abaixo.',
            tempPassword: newPassword
        });

    } catch (e: any) {
        console.error("Reset Error:", e);
        return NextResponse.json({ error: 'Erro ao resetar senha: ' + e.message }, { status: 500 });
    }
}
