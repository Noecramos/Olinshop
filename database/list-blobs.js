const { list } = require('@vercel/blob');
require('dotenv').config({ path: '.env.local' });

async function listBlobs() {
    console.log('📦 Listing Blobs...\n');
    const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });

    blobs.forEach(blob => {
        if (blob.pathname.includes('olinshop-header') || blob.pathname.includes('olinshop-logo')) {
            console.log(`FOUND|${blob.pathname}|${blob.url}`);
        }
    });
}

listBlobs().catch(console.error);
