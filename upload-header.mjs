import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

async function uploadHeaderImage() {
    try {
        console.log('📤 Uploading OlinShop header image to Vercel Blob...');

        // Path to the uploaded image
        const imagePath = 'C:/Users/noecr/.gemini/antigravity/brain/4dddce5d-6f1c-482e-8bd8-2132e9486909/uploaded_image_1768431522550.png';

        // Read the file
        const fileBuffer = readFileSync(imagePath);

        // Upload to Vercel Blob with unique filename
        const filename = `olinshop-header-${Date.now()}.png`;
        const blob = await put(filename, fileBuffer, {
            access: 'public',
            addRandomSuffix: false,
            contentType: 'image/png',
        });

        console.log('✅ Upload successful!');
        console.log('🔗 Image URL:', blob.url);
        console.log('\n📋 Copy this URL to update the header image configuration');

        return blob.url;
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 Make sure BLOB_READ_WRITE_TOKEN is set in your environment');
        console.error('Run: vercel env pull');
    }
}

uploadHeaderImage();
