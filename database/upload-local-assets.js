const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function uploadLocalImages() {
    console.log('🚀 Uploading local assets to Vercel Blob...\n');

    const files = [
        'public/olinshop-header.png',
        'public/olinshop-logo.png'
    ];

    for (const filePath of files) {
        try {
            const absolutePath = path.resolve(filePath);
            if (!fs.existsSync(absolutePath)) {
                console.error(`❌ File not found: ${filePath}`);
                continue;
            }

            console.log(`Uploading ${filePath}...`);
            const fileBuffer = fs.readFileSync(absolutePath);
            const filename = path.basename(filePath);

            const blob = await put(filename, fileBuffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN
            });

            console.log(`✅ Uploaded: ${filename}`);
            console.log(`URL: ${blob.url}\n`);

        } catch (error) {
            console.error(`❌ Error uploading ${filePath}:`, error.message);
        }
    }
}

uploadLocalImages()
    .then(() => process.exit(0))
    .catch(console.error);
