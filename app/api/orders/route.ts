import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Helper to check if a string is a valid UUID
// Helper to check if a string is a valid UUID/ID
const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || /^[0-9a-f]{24}$/i.test(id);

// Helper to get next ticket number
async function getNextTicketNumber(restaurantId: string) {
    if (!isValidUUID(restaurantId)) return 1;
    try {
        const { rows } = await sql`
            SELECT MAX(ticket_number) as max_ticket 
            FROM orders 
            WHERE restaurant_id = ${restaurantId}
        `;
        return (rows[0]?.max_ticket || 0) + 1;
    } catch (e) {
        return 1;
    }
}

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const restaurantId = searchParams.get('restaurantId');
        const clearHistory = searchParams.get('clearHistory');
        const customerEmail = searchParams.get('customerEmail');

        if (clearHistory === 'true' && restaurantId && isValidUUID(restaurantId)) {
            await sql`
                DELETE FROM orders 
                WHERE restaurant_id = ${restaurantId} 
                AND status IN ('delivered', 'cancelled', 'sent')
            `;
            return NextResponse.json({ success: true });
        }

        let query;
        if (customerEmail) {
            // Fetch orders for a specific customer across all stores
            query = sql`
                SELECT 
                    o.id, o.restaurant_id as "restaurantId", o.ticket_number as "ticketNumber",
                    o.customer_name as "customerName", o.customer_phone as "customerPhone", 
                    o.customer_address as "customerAddress", o.customer_zip_code as "customerZipCode",
                    o.items, o.subtotal, o.delivery_fee as "deliveryFee", o.total, 
                    o.payment_method as "paymentMethod", o.change_for as "changeFor", o.observations,
                    o.status, o.created_at as "createdAt", o.customer_email as "customerEmail",
                    o.service_type as "serviceType", o.table_number as "tableNumber", 
                    o.shipping_method as "shippingMethod", o.customer_cpf as "customerCpf",
                    r.name as "restaurantName", r.slug as "restaurantSlug", r.image as "restaurantImage"
                FROM orders o
                JOIN restaurants r ON o.restaurant_id = r.id
                WHERE o.customer_email = ${customerEmail}
                ORDER BY o.created_at DESC 
                LIMIT 20
            `;
        } else {
            if (!restaurantId || !isValidUUID(restaurantId)) {
                return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 });
            }
            query = sql`
                SELECT 
                    id, restaurant_id as "restaurantId", ticket_number as "ticketNumber",
                    customer_name as "customerName", customer_phone as "customerPhone", 
                    customer_address as "customerAddress", customer_zip_code as "customerZipCode",
                    items, subtotal, delivery_fee as "deliveryFee", total, 
                    payment_method as "paymentMethod", change_for as "changeFor", observations,
                    status, created_at as "createdAt", service_type as "serviceType", 
                    table_number as "tableNumber", shipping_method as "shippingMethod",
                    customer_cpf as "customerCpf", customer_email as "customerEmail"
                FROM orders 
                WHERE restaurant_id = ${restaurantId} 
                ORDER BY created_at DESC 
                LIMIT 100
            `;
        }

        const { rows } = await query;

        // Transform to nested structure expected by frontend
        const orders = rows.map(order => ({
            id: order.id,
            restaurantId: order.restaurantId,
            ticketNumber: order.ticketNumber,
            customer: {
                name: order.customerName,
                phone: order.customerPhone,
                address: order.customerAddress,
                zipCode: order.customerZipCode,
                cpf: order.customerCpf
            },
            items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
            subtotal: Number(order.subtotal),
            deliveryFee: Number(order.deliveryFee),
            total: Number(order.total),
            paymentMethod: order.paymentMethod,
            changeFor: order.changeFor ? Number(order.changeFor) : null,
            observations: order.observations,
            status: order.status,
            createdAt: order.createdAt,
            serviceType: order.serviceType,
            tableNumber: order.tableNumber,
            shippingMethod: order.shippingMethod,
            // Add restaurant info for cross-restaurant listings
            restaurantName: order.restaurantName,
            restaurantSlug: order.restaurantSlug,
            restaurantImage: order.restaurantImage
        }));

        return NextResponse.json(orders);

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            restaurantId, customerName, customerPhone, customerAddress, customerZipCode,
            items, subtotal, deliveryFee, total, paymentMethod, changeFor, observations,
            serviceType, tableNumber, shippingMethod, customerCpf, customerEmail
        } = body;

        // Validations
        if (!restaurantId || !isValidUUID(restaurantId)) {
            return NextResponse.json({ error: "ID do restaurante inválido ou ausente." }, { status: 400 });
        }
        if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Dados do pedido incompletos." }, { status: 400 });
        }

        const ticketNumber = await getNextTicketNumber(restaurantId);

        // --- Stock Control Logic ---
        try {
            for (const item of items) {
                const productId = item.id;
                // Valid string check instead of strict UUID to be safe
                if (!productId || typeof productId !== 'string' || productId.length < 10) continue;

                const { rows: pRows } = await sql`SELECT track_stock, stock_quantity, variants FROM products WHERE id = ${productId}`;
                if (pRows.length > 0) {
                    const product = pRows[0];
                    if (product.track_stock) {
                        let newStockQuantity = (product.stock_quantity || 0) - (item.quantity || 1);
                        let updatedVariants = product.variants;

                        // If it has variants, update the stock inside the variants JSON
                        if (item.selectedVariants && updatedVariants) {
                            let variantsObj = null;
                            try {
                                variantsObj = typeof updatedVariants === 'string' ? JSON.parse(updatedVariants) : updatedVariants;
                            } catch (e) {
                                variantsObj = null;
                            }

                            if (Array.isArray(variantsObj)) {
                                let changed = false;
                                for (const [vName, selectedOpt] of Object.entries(item.selectedVariants)) {
                                    // Match by name trimmed to be safe
                                    const variant = variantsObj.find((v: { name: string; options: any[] }) =>
                                        v.name.trim() === vName.trim() ||
                                        v.name.trim().toLowerCase() === vName.trim().toLowerCase()
                                    );
                                    if (variant && Array.isArray(variant.options)) {
                                        const option = variant.options.find((o: { name: string; stock: string } | string) => {
                                            const optName = (typeof o === 'string' ? o : o.name).trim();
                                            const selOpt = (selectedOpt as string).trim();
                                            return optName === selOpt || optName.toLowerCase() === selOpt.toLowerCase();
                                        });

                                        if (option && typeof option === 'object') {
                                            const currentStock = parseFloat(option.stock.toString()) || 0;
                                            option.stock = Math.max(0, parseFloat((currentStock - (item.quantity || 1)).toFixed(3)));
                                            changed = true;
                                        }
                                    }
                                }
                                if (changed) updatedVariants = variantsObj;
                            }
                        }

                        // Update the database
                        await sql`
                            UPDATE products 
                            SET 
                                stock_quantity = ${Math.max(0, parseFloat(newStockQuantity.toFixed(3)))}, 
                                variants = ${JSON.stringify(updatedVariants)}::jsonb,
                                updated_at = NOW()
                            WHERE id = ${productId}
                        `;
                    }
                }
            }
        } catch (stockError) {
            console.error("Stock Update Error:", stockError);
        }
        // --- End Stock Control Logic ---

        const ticketNumberValue = ticketNumber;
        const nSubtotal = parseFloat(subtotal) || 0;
        const nDeliveryFee = parseFloat(deliveryFee) || 0;
        const nTotal = parseFloat(total) || 0;
        const nChangeFor = changeFor ? parseFloat(changeFor) : null;

        const { rows } = await sql`
            INSERT INTO orders (
                restaurant_id, ticket_number, customer_name, customer_phone, 
                customer_address, customer_zip_code, items, subtotal, 
                delivery_fee, total, payment_method, change_for, observations, 
                status, service_type, table_number, shipping_method, customer_cpf,
                customer_email
            ) VALUES (
                ${restaurantId}, ${ticketNumberValue}, ${customerName}, ${customerPhone},
                ${customerAddress}, ${customerZipCode}, ${JSON.stringify(items)}, 
                ${nSubtotal}, ${nDeliveryFee}, ${nTotal}, ${paymentMethod}, 
                ${nChangeFor}, ${observations}, 'pending', ${serviceType}, ${tableNumber}, ${shippingMethod}, ${customerCpf},
                ${customerEmail}
            ) RETURNING 
                id, restaurant_id as "restaurantId", ticket_number as "ticketNumber",
                customer_name as "customerName", customer_phone as "customerPhone",
                customer_address as "customerAddress", customer_zip_code as "customerZipCode",
                items, subtotal, delivery_fee as "deliveryFee", total,
                payment_method as "paymentMethod", change_for as "changeFor",
                observations, status, created_at as "createdAt",
                service_type as "serviceType", table_number as "tableNumber",
                customer_cpf as "customerCpf", customer_email as "customerEmail"
        `;

        const order = rows[0];
        // Mirror the structure expected by frontend (nested customer)
        return NextResponse.json({
            ...order,
            customer: {
                name: order.customerName,
                phone: order.customerPhone,
                address: order.customerAddress,
                zipCode: order.customerZipCode,
                email: order.customerEmail
            },
            items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
            subtotal: Number(order.subtotal),
            deliveryFee: Number(order.deliveryFee),
            total: Number(order.total),
            changeFor: order.changeFor ? Number(order.changeFor) : null
        });

    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({
            error: "Falha ao criar pedido no banco de dados.",
            details: error.message
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status, observations, customerAddress, customerPhone } = body;

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        const updates = [];
        const values = [];

        if (status) {
            updates.push(`status = $${values.length + 1}`);
            values.push(status);
        }
        if (observations !== undefined) {
            updates.push(`observations = $${values.length + 1}`);
            values.push(observations);
        }
        if (customerAddress !== undefined) {
            updates.push(`customer_address = $${values.length + 1}`);
            values.push(customerAddress);
        }
        if (customerPhone !== undefined) {
            updates.push(`customer_phone = $${values.length + 1}`);
            values.push(customerPhone);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        // Add ID as the last parameter
        values.push(id);

        // Construct the query dynamically
        // Note: @vercel/postgres sql template literal doesn't support dynamic columns easily with parameter interpolation in this specific way without careful handling.
        // However, we can use the main `sql` tag for safety if we construct firmly.
        // But since I need to be safe, I'll stick to fixed queries or a smarter dynamic approach if possible.
        // Given the limited fields, I'll use a standard update.

        const result = await sql`
            UPDATE orders 
            SET 
                status = COALESCE(${status || null}, status),
                observations = COALESCE(${observations === undefined ? null : observations}, observations),
                customer_address = COALESCE(${customerAddress === undefined ? null : customerAddress}, customer_address),
                customer_phone = COALESCE(${customerPhone === undefined ? null : customerPhone}, customer_phone),
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING id, status, observations, customer_address as "customerAddress", customer_phone as "customerPhone", updated_at as "updatedAt"
        `;

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        const result = await sql`
            DELETE FROM orders 
            WHERE id = ${id}
        `;

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
}
