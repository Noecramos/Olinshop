import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const type = searchParams.get('type');

        if (!email) {
            return NextResponse.json({ error: 'Email parameter required' }, { status: 400, headers: corsHeaders });
        }

        // Fetch all approved stores with this email AND same type/segment
        const { rows } = type 
            ? await sql`
                SELECT 
                    id, name, slug, responsible_name as "responsibleName",
                    email, whatsapp, instagram,
                    zip_code as "zipCode", address, hours, type, image, pix_key as "pixKey",
                    latitude, longitude, delivery_radius as "deliveryRadius",
                    delivery_fee as "deliveryFee", delivery_fee_tiers as "deliveryFeeTiers",
                    delivery_time as "deliveryTime", popular_title as "popularTitle",
                    welcome_subtitle as "welcomeSubtitle", approved, is_open as "isOpen",
                    multistore_enabled as "multistoreEnabled",
                    rating_sum as "ratingSum", rating_count as "ratingCount",
                    created_at as "createdAt", updated_at as "updatedAt"
                FROM restaurants
                WHERE email = ${email} AND type = ${type} AND approved = true
                ORDER BY name ASC
            `
            : await sql`
                SELECT 
                    id, name, slug, responsible_name as "responsibleName",
                    email, whatsapp, instagram,
                    zip_code as "zipCode", address, hours, type, image, pix_key as "pixKey",
                    latitude, longitude, delivery_radius as "deliveryRadius",
                    delivery_fee as "deliveryFee", delivery_fee_tiers as "deliveryFeeTiers",
                    delivery_time as "deliveryTime", popular_title as "popularTitle",
                    welcome_subtitle as "welcomeSubtitle", approved, is_open as "isOpen",
                    multistore_enabled as "multistoreEnabled",
                    rating_sum as "ratingSum", rating_count as "ratingCount",
                    created_at as "createdAt", updated_at as "updatedAt"
                FROM restaurants
                WHERE email = ${email} AND approved = true
                ORDER BY name ASC
            `;

        return NextResponse.json(rows, { headers: corsHeaders });

    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({
            error: "Failed to fetch sibling stores",
            details: error.message
        }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS(request: Request) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    return new NextResponse(null, { status: 200, headers: corsHeaders });
}
