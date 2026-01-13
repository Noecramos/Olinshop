// Safe color replacement script
const fs = require('fs');
const path = require('path');

const files = [
    'app/signup/page.tsx',
    'app/login/page.tsx',
    'app/register/page.tsx',
    'app/checkout/page.tsx',
    'app/admin/super/page.tsx',
    'app/components/ProductModal.tsx',
    'app/components/admin/CategoryForm.tsx',
    'app/components/admin/Charts.tsx'
];

const replacements = [
    { from: /#007AFF/g, to: '#E91E8C' },
    { from: /#0062CC/g, to: '#D01A7D' },
    { from: /bg-blue-50/g, to: 'bg-pink-50' }
];

console.log('🎨 Updating colors to magenta gradient...\n');

files.forEach(file => {
    const filePath = path.join(__dirname, '..', file);

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        replacements.forEach(({ from, to }) => {
            if (content.match(from)) {
                content = content.replace(from, to);
                changed = true;
            }
        });

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated: ${file}`);
        } else {
            console.log(`⏭️  Skipped: ${file} (already updated)`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${file}:`, error.message);
    }
});

console.log('\n✨ Color update complete!');
