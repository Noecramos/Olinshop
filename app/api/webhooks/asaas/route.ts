
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Types for Asaas Webhook
type Asaasevent =
    | "PAYMENT_CREATED"
    | "PAYMENT_RECEIVED"
    | "PAYMENT_CONFIRMED"
    | "PAYMENT_OVERDUE"
    | "PAYMENT_REFUNDED"
    | "SUBSCRIPTION_CREATED"
    | "SUBSCRIPTION_UPDATED"
    | "SUBSCRIPTION_DELETED";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const event: Asaasevent = body.event;
        const payment = body.payment;

        console.log(`Received Asaas Webhook: ${event}`, payment.id);

        // Verify token if needed
        const token = req.headers.get("asaas-access-token");
        if (process.env.ASAAS_WEBHOOK_SECRET && token !== process.env.ASAAS_WEBHOOK_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
            // payment.subscription is the subscription ID
            const subscriptionId = payment.subscription;

            if (subscriptionId) {
                // Calculate expiration date (e.g. +30 days or based on cycle)
                // For simplicity, we just set status to active. 
                // A robust system would query the plan details to know exactly how much to extend.
                // But since we just want to unlock features:

                await sql`
          UPDATE restaurants 
          SET 
            subscription_status = 'active',
            subscription_expires_at = NOW() + INTERVAL '1 month' 
          WHERE asaas_subscription_id = ${subscriptionId}
        `;
                // Note: Interval should ideally depend on the plan cycle (MONTHLY, YEARLY etc)
                // We can start with 1 month or look up the plan. 
                // Improvement: Store 'current_period_end' from Asaas if available.
            }

            // Log payment to payments table
            await sql`
        INSERT INTO payments (
          restaurant_id, 
          asaas_payment_id, 
          amount, 
          status, 
          payment_method,
          created_at
        )
        SELECT id, ${payment.id}, ${payment.value}, ${event}, ${payment.billingType}, NOW()
        FROM restaurants 
        WHERE asaas_subscription_id = ${subscriptionId}
        ON CONFLICT (id) DO NOTHING;
      `;
            // Note: The insert above is a bit tricky because we need restaurant_id. 
            // Sub-select resolves it.
        }

        if (event === "PAYMENT_OVERDUE") {
            const subscriptionId = payment.subscription;
            if (subscriptionId) {
                await sql`
          UPDATE restaurants 
          SET subscription_status = 'overdue'
          WHERE asaas_subscription_id = ${subscriptionId}
        `;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
    }
}
