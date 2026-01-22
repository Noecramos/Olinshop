require('dotenv').config();
const { sql } = require('@vercel/postgres');

async function findAndDeleteDuplicateSlug() {
    try {
        // Find all restaurants ordered by creation date
        const { rows } = await sql`
            SELECT id, name, slug, created_at, approved 
            FROM restaurants 
            ORDER BY created_at DESC 
            LIMIT 20
        `;

        console.log('\n=== Recent Restaurants ===');
        rows.forEach(row => {
            console.log(`ID: ${row.id} | Slug: ${row.slug} | Name: ${row.name} | Approved: ${row.approved} | Created: ${row.created_at}`);
        });

        // Find duplicates
        const duplicates = await sql`
            SELECT slug, COUNT(*) as count 
            FROM restaurants 
            GROUP BY slug 
            HAVING COUNT(*) > 1
        `;

        if (duplicates.rows.length > 0) {
            console.log('\n=== Duplicate Slugs Found ===');
            duplicates.rows.forEach(dup => {
                console.log(`Slug: ${dup.slug} | Count: ${dup.count}`);
            });

            // Delete unapproved duplicates
            for (const dup of duplicates.rows) {
                console.log(`\nDeleting unapproved duplicates for slug: ${dup.slug}`);
                const deleted = await sql`
                    DELETE FROM restaurants 
                    WHERE slug = ${dup.slug} 
                    AND approved = false 
                    AND id NOT IN (
                        SELECT id FROM restaurants 
                        WHERE slug = ${dup.slug} 
                        ORDER BY created_at DESC 
                        LIMIT 1
                    )
                    RETURNING id, name
                `;
                console.log(`Deleted ${deleted.rows.length} records:`, deleted.rows);
            }
        } else {
            console.log('\nNo duplicate slugs found.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

findAndDeleteDuplicateSlug();
