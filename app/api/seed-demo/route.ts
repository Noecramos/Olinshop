import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Get or create the demo restaurant
        const restaurantResult = await sql`
            INSERT INTO restaurants (
                name, slug, responsible_name, email, whatsapp, instagram,
                zip_code, address, hours, type, image, pix_key, password, approved,
                delivery_fee, delivery_time
            ) VALUES (
                'Fashion Store Demo', 'fashion-demo', 'Admin Demo', 'demo@fashionstore.com',
                '5581999887766', '@fashionstore', '50010000',
                'Av. Guararapes, 100, Santo Antônio, Recife, PE',
                'Seg-Sex 9h às 18h', 'Moda',
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
                'demo@fashionstore.com', 'demo123', true, 0, '30-45 min'
            )
            ON CONFLICT (slug) DO UPDATE SET
                name = EXCLUDED.name,
                approved = true
            RETURNING id
        `;

        const restaurantId = restaurantResult.rows[0].id;

        // Delete existing data
        await sql`DELETE FROM categories WHERE restaurant_id = ${restaurantId}`;
        await sql`DELETE FROM products WHERE restaurant_id = ${restaurantId}`;

        // Insert categories
        await sql`
            INSERT INTO categories (restaurant_id, name) VALUES
                (${restaurantId}, 'Roupas Femininas'),
                (${restaurantId}, 'Roupas Masculinas'),
                (${restaurantId}, 'Calçados'),
                (${restaurantId}, 'Acessórios')
        `;

        // Insert products with variants
        const products = [
            {
                name: 'Camiseta Oversized',
                price: 89.90,
                category: 'Roupas Femininas',
                description: 'Camiseta oversized 100% algodão, modelagem ampla e confortável. Perfeita para o dia a dia.',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
                variants: [
                    { name: 'Tamanho', options: ['P', 'M', 'G', 'GG'] },
                    { name: 'Cor', options: ['Preto', 'Branco', 'Azul', 'Rosa'] }
                ]
            },
            {
                name: 'Calça Jeans Skinny',
                price: 159.90,
                category: 'Roupas Femininas',
                description: 'Calça jeans skinny de cintura alta, tecido stretch para maior conforto e mobilidade.',
                image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
                variants: [
                    { name: 'Tamanho', options: ['36', '38', '40', '42', '44'] }
                ]
            },
            {
                name: 'Tênis Casual Unissex',
                price: 249.90,
                category: 'Calçados',
                description: 'Tênis casual confortável, solado de borracha antiderrapante. Ideal para uso diário.',
                image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
                variants: [
                    { name: 'Tamanho', options: ['37', '38', '39', '40', '41', '42', '43'] },
                    { name: 'Cor', options: ['Preto', 'Branco', 'Vermelho', 'Azul'] }
                ]
            },
            {
                name: 'Camisa Social Slim Fit',
                price: 129.90,
                category: 'Roupas Masculinas',
                description: 'Camisa social slim fit, tecido de alta qualidade com toque macio. Perfeita para o trabalho.',
                image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
                variants: [
                    { name: 'Tamanho', options: ['P', 'M', 'G', 'GG'] },
                    { name: 'Cor', options: ['Branco', 'Azul Claro', 'Preto', 'Cinza'] }
                ]
            },
            {
                name: 'Boné Snapback',
                price: 69.90,
                category: 'Acessórios',
                description: 'Boné snapback ajustável, aba reta. Material resistente e confortável.',
                image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
                variants: [
                    { name: 'Cor', options: ['Preto', 'Azul', 'Verde', 'Vermelho', 'Branco'] }
                ]
            },
            {
                name: 'Relógio Digital Esportivo',
                price: 199.90,
                category: 'Acessórios',
                description: 'Relógio digital esportivo à prova d\'água, cronômetro e alarme. Pulseira de silicone.',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                variants: [
                    { name: 'Cor', options: ['Prata', 'Dourado', 'Preto', 'Rose'] }
                ]
            },
            {
                name: 'Vestido Midi Floral',
                price: 179.90,
                category: 'Roupas Femininas',
                description: 'Vestido midi com estampa floral, tecido leve e fluido. Perfeito para o verão.',
                image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
                variants: [
                    { name: 'Tamanho', options: ['P', 'M', 'G', 'GG'] },
                    { name: 'Cor', options: ['Floral Azul', 'Floral Rosa', 'Floral Verde'] }
                ]
            },
            {
                name: 'Jaqueta Jeans Clássica',
                price: 219.90,
                category: 'Roupas Masculinas',
                description: 'Jaqueta jeans clássica, corte reto. Material durável e atemporal.',
                image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
                variants: [
                    { name: 'Tamanho', options: ['P', 'M', 'G', 'GG', 'XGG'] }
                ]
            },
            {
                name: 'Mochila Urbana Impermeável',
                price: 149.90,
                category: 'Acessórios',
                description: 'Mochila urbana com compartimento para notebook, material impermeável.',
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
                variants: [
                    { name: 'Cor', options: ['Preto', 'Cinza', 'Azul Marinho', 'Verde Militar'] }
                ]
            },
            {
                name: 'Shorts Esportivo Dry Fit',
                price: 79.90,
                category: 'Roupas Masculinas',
                description: 'Shorts esportivo com tecnologia dry fit, secagem rápida. Ideal para treinos.',
                image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
                variants: [
                    { name: 'Tamanho', options: ['P', 'M', 'G', 'GG'] },
                    { name: 'Cor', options: ['Preto', 'Azul', 'Cinza', 'Verde'] }
                ]
            }
        ];

        // Insert each product
        for (const product of products) {
            await sql`
                INSERT INTO products (restaurant_id, name, price, category, description, image, variants)
                VALUES (
                    ${restaurantId},
                    ${product.name},
                    ${product.price},
                    ${product.category},
                    ${product.description},
                    ${product.image},
                    ${JSON.stringify(product.variants)}
                )
            `;
        }

        return NextResponse.json({
            success: true,
            message: 'Demo shop created successfully!',
            shop: {
                name: 'Fashion Store Demo',
                slug: 'fashion-demo',
                password: 'demo123',
                url: '/loja/fashion-demo',
                adminUrl: '/admin/fashion-demo',
                productsCount: products.length
            }
        });

    } catch (error) {
        console.error('Error creating demo shop:', error);
        return NextResponse.json({ error: 'Failed to create demo shop', details: error }, { status: 500 });
    }
}
