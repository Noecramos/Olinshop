// Refactor hardcoded colors to Tailwind classes
const fs = require('fs');
const path = require('path');

const replacementMap = [
    { from: /bg-\[#E91E8C\]/g, to: 'bg-accent' },
    { from: /text-\[#E91E8C\]/g, to: 'text-accent' },
    { from: /border-\[#E91E8C\]/g, to: 'border-accent' },
    { from: /ring-\[#E91E8C\]/g, to: 'ring-accent' },
    { from: /from-\[#E91E8C\]/g, to: 'from-accent' },
    { from: /to-\[#E91E8C\]/g, to: 'to-accent' },

    // Hover states (Darker Magenta)
    { from: /hover:bg-\[#D01A7D\]/g, to: 'hover:bg-accent-hover' },
    { from: /hover:text-\[#D01A7D\]/g, to: 'hover:text-accent-hover' },

    // Secondary/Gradient Colors
    { from: /to-\[#6B4CE6\]/g, to: 'to-accent-secondary' },
    { from: /text-\[#6B4CE6\]/g, to: 'text-accent-secondary' },

    // Raw hex in style tags (advanced) - handling common cases
    { from: /'#E91E8C'/g, to: "'var(--accent)'" },
    { from: /"#E91E8C"/g, to: '"var(--accent)"' }
];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

console.log('🎨 Refactoring colors to use Tailwind variables...\n');

const files = getAllFiles(path.join(__dirname, '..', 'app'));
let modifiedCount = 0;

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let originalContent = content;

        replacementMap.forEach(({ from, to }) => {
            content = content.replace(from, to);
        });

        if (content !== originalContent) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✅ Updated: ${path.relative(path.join(__dirname, '..'), file)}`);
            modifiedCount++;
        }
    } catch (e) {
        console.error(`❌ Error in ${file}:`, e);
    }
});

console.log(`\n✨ Refactored ${modifiedCount} files to use dynamic theme!`);
