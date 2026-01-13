const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });
const map = require('./uploaded_assets_map.json');

async function update() {
    console.log('🔄 Updating DB with new assets...\n');

    try {
        // Logo
        await sql`UPDATE global_settings SET value = ${map["App Logo.png"]} WHERE key = 'headerImage'`;
        console.log('✅ Updated headerImage (Logo)');

        // Main Header
        await sql`UPDATE global_settings SET value = ${map["Header Main page.png"]} WHERE key = 'headerBackgroundImage'`;
        console.log('✅ Updated headerBackgroundImage (Main Page)');

        // Page Header (Admin etc)
        await sql`UPDATE global_settings SET value = ${map["all Page header.png"]} WHERE key = 'pageHeaderImage'`;
        console.log('✅ Updated pageHeaderImage (All Pages)');

        // Splash
        const splashUrl = map["splash Screen.jpg"];
        const splashCheck = await sql`SELECT key FROM global_settings WHERE key = 'splashImage'`;
        if (splashCheck.rows.length === 0) {
            await sql`INSERT INTO global_settings (key, value) VALUES ('splashImage', ${splashUrl})`;
        } else {
            await sql`UPDATE global_settings SET value = ${splashUrl} WHERE key = 'splashImage'`;
        }
        console.log('✅ Updated splashImage');

    } catch (e) {
        console.error(e);
    }
}

update().then(() => process.exit(0)).catch(console.error);
