const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function upload() {
    console.log('🚀 Uploading new assets...\n');
    const folder = 'public/upload';

    // Check if folder exists
    if (!fs.existsSync(folder)) {
        console.error("Folder public/upload does not exist!");
        process.exit(1);
    }

    const files = fs.readdirSync(folder);
    const uploaded = {};

    for (const file of files) {
        // Skip non-image files or hidden files
        if (file.startsWith('.')) continue;

        const filePath = path.join(folder, file);
        const buffer = fs.readFileSync(filePath);

        // Sanitize filename for blob (remove spaces)
        const safeName = file.replace(/\s+/g, '-').toLowerCase();

        console.log(`Uploading ${file} as ${safeName}...`);
        const blob = await put(safeName, buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: false // Overwrite if exists to keep URLs clean
        });

        uploaded[file] = blob.url;
        console.log(`✅ URL: ${blob.url}`);
    }

    // Save mapping to file for next step
    fs.writeFileSync('database/uploaded_assets_map.json', JSON.stringify(uploaded, null, 2));
    console.log('\n📝 Mapping saved to database/uploaded_assets_map.json');
}

upload().catch((err) => {
    console.error(err);
    process.exit(1);
});
