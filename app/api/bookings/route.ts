import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = 'force-dynamic';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: Request) {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// GET - Fetch bookings for a restaurant
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const restaurantId = searchParams.get('restaurantId');
        const date = searchParams.get('date'); // Optional: filter by date
        const status = searchParams.get('status'); // Optional: filter by status

        if (!restaurantId) {
            return NextResponse.json({ error: 'Restaurant ID required' }, { status: 400, headers: corsHeaders });
        }

        let queryStr = `
            SELECT 
                b.*,
                json_agg(
                    json_build_object(
                        'id', bi.id,
                        'product_id', bi.product_id,
                        'product_name', bi.product_name,
                        'product_price', bi.product_price,
                        'quantity', bi.quantity
                    )
                ) as items
            FROM bookings b
            LEFT JOIN booking_items bi ON b.id = bi.booking_id
            WHERE b.restaurant_id = $1
        `;

        const params: any[] = [restaurantId];

        if (date) {
            params.push(date);
            queryStr += ` AND b.booking_date = $${params.length}`;
        }

        if (status) {
            params.push(status);
            queryStr += ` AND b.status = $${params.length}`;
        }

        queryStr += ` GROUP BY b.id ORDER BY b.booking_date DESC, b.booking_time DESC`;

        const { rows } = await sql.query(queryStr, params);

        return NextResponse.json(rows, { headers: corsHeaders });

    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({
            error: "Failed to fetch bookings",
            details: error.message
        }, { status: 500, headers: corsHeaders });
    }
}

// POST - Create new booking
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            restaurantId,
            customerName,
            customerPhone,
            customerEmail,
            bookingDate,
            bookingTime,
            duration,
            notes,
            items // Array of { productId, productName, productPrice, quantity }
        } = body;

        // Validation
        if (!restaurantId || !customerName || !customerPhone || !bookingDate || !bookingTime || !items || items.length === 0) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400, headers: corsHeaders });
        }

        // Check if time slot is available
        // Check if time slot is available (Overlap Logic)
        const { rows: existingBookings } = await sql`
            SELECT booking_time, duration FROM bookings
            WHERE restaurant_id = ${restaurantId}
            AND booking_date = ${bookingDate}
            AND status NOT IN ('cancelled', 'completed')
        `;

        const toMinutes = (time: string) => {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        };

        const newStart = toMinutes(bookingTime);
        const newEnd = newStart + (parseInt(duration) || 30);

        const hasOverlap = existingBookings.some((b: any) => {
            const bStart = toMinutes(b.booking_time);
            const bEnd = bStart + (b.duration || 30);
            return (newStart < bEnd && newEnd > bStart);
        });

        if (hasOverlap) {
            return NextResponse.json({
                error: 'Time slot overlaps with an existing booking',
                available: false
            }, { status: 409, headers: corsHeaders });
        }

        // Calculate total price
        const totalPrice = items.reduce((sum: number, item: any) =>
            sum + (parseFloat(item.productPrice) * item.quantity), 0
        );

        // Get deposit percentage from restaurant settings
        const { rows: [restaurant] } = await sql`
            SELECT booking_deposit_percent FROM restaurants WHERE id = ${restaurantId}
        `;
        const depositPercent = restaurant?.booking_deposit_percent || 50;
        const depositAmount = (totalPrice * depositPercent) / 100;

        // Generate PIX code (simplified - in production use proper PIX API)
        const pixCode = `PIX-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

        // Create booking
        const { rows: [booking] } = await sql`
            INSERT INTO bookings (
                restaurant_id, customer_name, customer_phone, customer_email,
                booking_date, booking_time, duration, total_price, deposit_amount,
                pix_code, notes, status, payment_status
            ) VALUES (
                ${restaurantId}, ${customerName}, ${customerPhone}, ${customerEmail || null},
                ${bookingDate}, ${bookingTime}, ${duration || 30}, ${totalPrice}, ${depositAmount},
                ${pixCode}, ${notes || null}, 'pending', 'pending'
            )
            RETURNING *
        `;

        // Create booking items
        for (const item of items) {
            await sql`
                INSERT INTO booking_items (
                    booking_id, product_id, product_name, product_price, quantity
                ) VALUES (
                    ${booking.id}, ${item.productId}, ${item.productName}, ${item.productPrice}, ${item.quantity}
                )
            `;
        }

        return NextResponse.json({
            success: true,
            booking: {
                ...booking,
                items
            },
            payment: {
                pixCode,
                amount: depositAmount,
                totalPrice,
                depositPercent
            }
        }, { headers: corsHeaders });

    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({
            error: "Failed to create booking",
            details: error.message
        }, { status: 500, headers: corsHeaders });
    }
}

// PUT - Update booking (confirm, cancel, complete, update payment)
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status, paymentStatus, cancelReason } = body;

        if (!id) {
            return NextResponse.json({ error: 'Booking ID required' }, { status: 400, headers: corsHeaders });
        }

        // Get current booking
        const { rows: [currentBooking] } = await sql`
            SELECT * FROM bookings WHERE id = ${id}
        `;

        if (!currentBooking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404, headers: corsHeaders });
        }

        // Check cancellation policy (2 hours before)
        if (status === 'cancelled') {
            const bookingDateTime = new Date(`${currentBooking.booking_date} ${currentBooking.booking_time}`);
            const now = new Date();
            const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

            // Get cancellation hours from restaurant
            const { rows: [restaurant] } = await sql`
                SELECT booking_cancellation_hours FROM restaurants WHERE id = ${currentBooking.restaurant_id}
            `;
            const cancellationHours = restaurant?.booking_cancellation_hours || 2;

            if (hoursUntilBooking < cancellationHours) {
                return NextResponse.json({
                    error: `Cancellation must be at least ${cancellationHours} hours before appointment`,
                    canCancel: false
                }, { status: 400, headers: corsHeaders });
            }
        }

        // Update booking
        const updateFields = [];
        const updateValues = [];

        if (status) {
            updateFields.push('status');
            updateValues.push(status);
            if (status === 'cancelled') {
                updateFields.push('cancelled_at');
                updateValues.push(new Date().toISOString());
            }
        }

        if (paymentStatus) {
            updateFields.push('payment_status');
            updateValues.push(paymentStatus);
        }

        updateFields.push('updated_at');
        updateValues.push(new Date().toISOString());

        const setClause = updateFields.map((field, i) => `${field} = $${i + 1}`).join(', ');

        const { rows: [updatedBooking] } = await sql.query(
            `UPDATE bookings SET ${setClause} WHERE id = $${updateFields.length + 1} RETURNING *`,
            [...updateValues, id]
        );

        return NextResponse.json({
            success: true,
            booking: updatedBooking
        }, { headers: corsHeaders });

    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({
            error: "Failed to update booking",
            details: error.message
        }, { status: 500, headers: corsHeaders });
    }
}
