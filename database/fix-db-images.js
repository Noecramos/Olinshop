const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function fixDbImages() {
    console.log('🔄 Fixing Database Images...\n');
    const headerUrl = 'https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/olinshop-header.png';
    const logoUrl = 'https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/olinshop-logo.png';

    try {
        await sql`UPDATE global_settings SET value = ${logoUrl} WHERE key = 'headerImage'`;

        // Ensure splashImage exists or update it
        const splashCheck = await sql`SELECT key FROM global_settings WHERE key = 'splashImage'`;
        if (splashCheck.rows.length === 0) {
            await sql`INSERT INTO global_settings (key, value) VALUES ('splashImage', ${logoUrl})`;
        } else {
            await sql`UPDATE global_settings SET value = ${logoUrl} WHERE key = 'splashImage'`;
        }

        await sql`UPDATE global_settings SET value = ${headerUrl} WHERE key = 'headerBackgroundImage'`;
        await sql`UPDATE global_settings SET value = ${headerUrl} WHERE key = 'pageHeaderImage'`;

        console.log('✅ Updated Database Settings Correctly.');

    } catch (error) {
        console.error('❌ Failed:', error);
    }
}

fixDbImages()
    .then(() => process.exit(0))
    .catch(console.error);
