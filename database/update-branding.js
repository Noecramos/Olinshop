// Update global config with new branding
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function updateBranding() {
    console.log('🎨 Updating OlinShop branding in database...\n');

    try {
        // Update splash screen logo
        await sql`
            INSERT INTO global_settings (key, value)
            VALUES ('headerImage', '/olinshop-logo.png')
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = NOW()
        `;
        console.log('✅ Updated splash screen logo');

        // Update header background to use gradient
        await sql`
            INSERT INTO global_settings (key, value)
            VALUES ('headerBackgroundType', 'color')
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = NOW()
        `;
        console.log('✅ Updated header background type');

        // Update header color to magenta gradient
        await sql`
            INSERT INTO global_settings (key, value)
            VALUES ('headerBgColor', 'linear-gradient(135deg, #E91E8C 0%, #6B4CE6 100%)')
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = NOW()
        `;
        console.log('✅ Updated header background color');

        // Update welcome title color
        await sql`
            INSERT INTO global_settings (key, value)
            VALUES ('welcomeTitle', 'Descubra as melhores lojas de Olinda!')
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = NOW()
        `;
        console.log('✅ Updated welcome title');

        // Update welcome subtitle
        await sql`
            INSERT INTO global_settings (key, value)
            VALUES ('welcomeSubtitle', 'Shopping Online')
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = NOW()
        `;
        console.log('✅ Updated welcome subtitle');

        console.log('\n🎉 Branding update complete!');
        console.log('💡 Refresh your browser to see the changes.\n');

    } catch (error) {
        console.error('❌ Failed to update branding:', error);
        throw error;
    }
}

updateBranding()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
