import { sql } from '@vercel/postgres';

async function updateLojaKyConfig() {
    try {
        console.log('🚀 Updating LojaKy production database...');

        // Update all config values
        const updates = {
            headerImage: '/logo-lojaky.png',
            splashImage: '/splash-lojaky.jpg',
            headerBackgroundImage: '/header-lojaky.png',
            headerBackgroundType: 'image',
            footerText: '© Noviapp Mobile Apps • LojAky®',
            headerBgColor: '#C8C4E9',
            welcomeSubtitle: 'Suas compra na LojAky'
        };

        for (const [key, value] of Object.entries(updates)) {
            await sql`
                INSERT INTO global_settings (key, value)
                VALUES (${key}, ${value})
                ON CONFLICT (key) DO UPDATE SET value = ${value}
            `;
            console.log(`✅ Updated ${key}: ${value}`);
        }

        console.log('');
        console.log('✅ ALL DATABASE UPDATES COMPLETE!');
        console.log('');
        console.log('Updated values:');
        console.log('- Header Image: /logo-lojaky.png');
        console.log('- Splash Image: /splash-lojaky.jpg');
        console.log('- Header Background: /header-lojaky.png');
        console.log('- Background Type: image');
        console.log('- Footer: © Noviapp Mobile Apps • LojAky®');
        console.log('- Header Color: #C8C4E9');
        console.log('- Welcome Subtitle: Suas compra na LojAky');
        console.log('');
        console.log('🌐 Visit https://lojaky.noviapp.com.br and refresh!');

    } catch (error) {
        console.error('❌ Error updating config:', error);
    }
}

updateLojaKyConfig();
