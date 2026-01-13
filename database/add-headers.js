// Add PageHeader to all pages that don't have it
const fs = require('fs');
const path = require('path');

const pagesToUpdate = [
    {
        file: 'app/signup/page.tsx',
        importLine: 'import { useAuth } from "../context/AuthContext";',
        newImport: 'import PageHeader from "../components/PageHeader";',
        oldWrapper: '<div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center py-8 px-4">',
        newWrapper: '<div className="min-h-screen bg-[#FAF8FC] flex flex-col">\n            <PageHeader />\n            <div className="flex-1 flex items-center justify-center py-8 px-4">'
    },
    {
        file: 'app/register/page.tsx',
        importLine: 'import { useState } from "react";',
        newImport: 'import PageHeader from "../components/PageHeader";',
        oldWrapper: '<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">',
        newWrapper: '<div className="min-h-screen bg-[#FAF8FC] flex flex-col">\n            <PageHeader />\n            <div className="flex-1 py-12 px-4">'
    },
    {
        file: 'app/checkout/page.tsx',
        importLine: 'import { useCart } from "../context/CartContext";',
        newImport: 'import PageHeader from "../components/PageHeader";',
        oldWrapper: '<div className="min-h-screen bg-[#F5F5F7] py-8">',
        newWrapper: '<div className="min-h-screen bg-[#FAF8FC] flex flex-col">\n            <PageHeader />\n            <div className="flex-1 py-8">'
    },
    {
        file: 'app/admin/page.tsx',
        importLine: 'import { useState } from "react";',
        newImport: 'import PageHeader from "../components/PageHeader";',
        oldWrapper: '<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">',
        newWrapper: '<div className="min-h-screen bg-[#FAF8FC] flex flex-col">\n            <PageHeader />\n            <div className="flex-1 flex items-center justify-center p-4">'
    },
    {
        file: 'app/admin/super/page.tsx',
        importLine: 'import { useEffect, useState } from "react";',
        newImport: 'import PageHeader from "../../components/PageHeader";',
        oldWrapper: '<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">',
        newWrapper: '<div className="min-h-screen bg-[#FAF8FC] flex flex-col">\n            <PageHeader />\n            <div className="flex-1 py-8 px-4">'
    }
];

console.log('🖼️  Adding headers to all pages...\n');

let updatedCount = 0;

pagesToUpdate.forEach(({ file, importLine, newImport, oldWrapper, newWrapper }) => {
    const filePath = path.join(__dirname, '..', file);

    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⏭️  Skipped: ${file} (not found)`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');

        // Check if already has PageHeader
        if (content.includes('PageHeader')) {
            console.log(`⏭️  Skipped: ${file} (already has header)`);
            return;
        }

        // Add import
        content = content.replace(importLine, `${importLine}\n${newImport}`);

        // Update wrapper - need to close the extra div at the end
        content = content.replace(oldWrapper, newWrapper);

        // Find the last closing div and add an extra one
        const lastDivIndex = content.lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
            content = content.slice(0, lastDivIndex + 6) + '\n        </div>' + content.slice(lastDivIndex + 6);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${file}`);
        updatedCount++;
    } catch (error) {
        console.error(`❌ Error updating ${file}:`, error.message);
    }
});

console.log(`\n✨ Added headers to ${updatedCount} pages!`);
console.log('\n📝 Note: Please verify the pages manually as automatic wrapping may need adjustment.');
