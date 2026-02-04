// Script to update global config in database for LojaKy
const { sql } = require('@vercel/postgres');

async function updateLojaKyConfig() {
    try {
        console.log('🚀 Updating LojaKy configuration...');

        // Update global_settings table
        await sql`
            UPDATE global_settings 
            SET 
                header_image = '/logo-lojaky.png',
                splash_image = 'https://i.imgur.com/pjzRyRN.gif',
                header_background_image = '/header-lojaky.png',
                welcome_subtitle = 'Suas compra na LojAky',
                footer_text = '© Noviapp Mobile Apps • LojAky®',
                header_bg_color = '#C8C4E9',
                header_background_type = 'color'
            WHERE id = 1
        `;

        console.log('✅ Database updated successfully!');
        console.log('');
        console.log('Updated values:');
        console.log('- Header Image: /logo-lojaky.png');
        console.log('- Splash Image: https://i.imgur.com/pjzRyRN.gif');
        console.log('- Welcome Subtitle: Suas compra na LojAky');
        console.log('- Footer: © Noviapp Mobile Apps • LojAky®');
        console.log('- Header Color: #C8C4E9');

    } catch (error) {
        console.error('❌ Error updating config:', error);
    }
}

updateLojaKyConfig();
