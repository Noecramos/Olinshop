import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = 'force-dynamic';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: Request) {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// GET - Get available time slots for a specific date
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const restaurantId = searchParams.get('restaurantId');
        const date = searchParams.get('date'); // YYYY-MM-DD format
        const duration = parseInt(searchParams.get('duration') || '30');

        if (!restaurantId || !date) {
            return NextResponse.json({
                error: 'Restaurant ID and date required'
            }, { status: 400, headers: corsHeaders });
        }

        // Get restaurant booking settings
        const { rows: [restaurant] } = await sql`
            SELECT booking_hours, booking_interval, booking_duration
            FROM restaurants
            WHERE id = ${restaurantId}
        `;

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404, headers: corsHeaders });
        }

        // Get day of week
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
        const bookingHours = restaurant.booking_hours || {};
        const dayHours = bookingHours[dayOfWeek] || [];

        if (dayHours.length === 0) {
            return NextResponse.json({
                available: [],
                message: 'No availability on this day'
            }, { headers: corsHeaders });
        }

        // Get existing bookings for this date
        const { rows: existingBookings } = await sql`
            SELECT booking_time, duration
            FROM bookings
            WHERE restaurant_id = ${restaurantId}
            AND booking_date = ${date}
            AND status NOT IN ('cancelled', 'completed')
        `;

        // Generate all possible time slots
        const interval = restaurant.booking_interval || 30;
        const availableSlots: string[] = [];

        for (const timeRange of dayHours) {
            const [startTime, endTime] = timeRange.split('-');
            const [startHour, startMin] = startTime.split(':').map(Number);
            const [endHour, endMin] = endTime.split(':').map(Number);

            let currentTime = startHour * 60 + startMin; // Convert to minutes
            const endTimeMinutes = endHour * 60 + endMin;

            while (currentTime + duration <= endTimeMinutes) {
                const hours = Math.floor(currentTime / 60);
                const minutes = currentTime % 60;
                const timeSlot = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                // Check if this slot is available (not conflicting with existing bookings)
                const isAvailable = !existingBookings.some((booking: any) => {
                    const bookingStart = booking.booking_time;
                    const bookingDuration = booking.duration || 30;

                    // Convert booking time to minutes
                    const [bHour, bMin] = bookingStart.split(':').map(Number);
                    const bookingStartMin = bHour * 60 + bMin;
                    const bookingEndMin = bookingStartMin + bookingDuration;

                    // Check for overlap
                    const slotEnd = currentTime + duration;
                    return (currentTime < bookingEndMin && slotEnd > bookingStartMin);
                });

                if (isAvailable) {
                    availableSlots.push(timeSlot);
                }

                currentTime += interval;
            }
        }

        return NextResponse.json({
            date,
            available: availableSlots,
            interval,
            duration
        }, { headers: corsHeaders });

    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({
            error: "Failed to fetch available slots",
            details: error.message
        }, { status: 500, headers: corsHeaders });
    }
}
