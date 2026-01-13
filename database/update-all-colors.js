// Comprehensive update script for all buttons and headers
const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'app/signup/page.tsx',
    'app/register/page.tsx',
    'app/checkout/page.tsx',
    'app/admin/page.tsx',
    'app/admin/super/page.tsx',
    'app/components/admin/GlobalConfigForm.tsx',
    'app/components/admin/ProductForm.tsx'
];

const colorReplacements = [
    // Ensure all reds are replaced with magenta
    { from: /#EA1D2C/g, to: '#E91E8C' },
    { from: /#C51623/g, to: '#D01A7D' },
    { from: /bg-red-500/g, to: 'bg-[#E91E8C]' },
    { from: /bg-red-600/g, to: 'bg-[#E91E8C]' },
    { from: /text-red-600/g, to: 'text-[#E91E8C]' },
    { from: /text-red-500/g, to: 'text-[#E91E8C]' },
    { from: /border-red-500/g, to: 'border-[#E91E8C]' },
    { from: /hover:bg-red-600/g, to: 'hover:bg-[#D01A7D]' },
    { from: /focus:ring-red-500/g, to: 'focus:ring-[#E91E8C]' },

    // Replace any remaining blues
    { from: /bg-blue-600/g, to: 'bg-[#E91E8C]' },
    { from: /bg-blue-500/g, to: 'bg-[#E91E8C]' },
    { from: /text-blue-600/g, to: 'text-[#E91E8C]' },
    { from: /hover:bg-blue-700/g, to: 'hover:bg-[#D01A7D]' }
];

console.log('🎨 Updating all buttons to magenta...\n');

let updatedCount = 0;

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, '..', file);

    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⏭️  Skipped: ${file} (not found)`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        colorReplacements.forEach(({ from, to }) => {
            if (content.match(from)) {
                content = content.replace(from, to);
                changed = true;
            }
        });

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated: ${file}`);
            updatedCount++;
        } else {
            console.log(`⏭️  Skipped: ${file} (already updated)`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${file}:`, error.message);
    }
});

console.log(`\n✨ Updated ${updatedCount} files with magenta colors!`);
