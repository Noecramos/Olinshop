const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function uploadHeaderImage() {
    try {
        // Path to the uploaded image
        const imagePath = 'C:/Users/noecr/.gemini/antigravity/brain/4dddce5d-6f1c-482e-8bd8-2132e9486909/uploaded_image_1768431522550.png';

        // Check if file exists
        if (!fs.existsSync(imagePath)) {
            console.error('❌ Image file not found:', imagePath);
            return;
        }

        console.log('📤 Uploading OlinShop header image to Vercel Blob...');

        // Read the file
        const fileBuffer = fs.readFileSync(imagePath);
        const blob = new Blob([fileBuffer], { type: 'image/png' });

        // Create form data
        const formData = new FormData();
        formData.append('file', blob, 'olinshop-header.png');

        // Upload to Vercel Blob via API
        const response = await fetch('https://olinshop.vercel.app/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Upload successful!');
            console.log('🔗 Image URL:', result.url);
            console.log('\n📝 Next steps:');
            console.log('1. Copy this URL:', result.url);
            console.log('2. Update the header image in the database or config');

            // Save URL to a file for reference
            fs.writeFileSync('header-image-url.txt', result.url);
            console.log('\n💾 URL saved to: header-image-url.txt');
        } else {
            console.error('❌ Upload failed:', result.message);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

uploadHeaderImage();
