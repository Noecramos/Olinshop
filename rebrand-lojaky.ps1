# PowerShell script to complete LojaKy rebranding
# Run this to update all remaining "OlinShop" references

Write-Host "🚀 LojaKy Rebranding - Batch Update Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$files = @(
    "app\register\page.tsx",
    "app\login\page.tsx",
    "app\checkout\page.tsx",
    "app\loja\[slug]\layout.tsx",
    "app\admin\page.tsx",
    "app\admin\[slug]\page.tsx",
    "app\admin\super\page.tsx",
    "app\components\PageHeader.tsx",
    "app\components\StoreHeader.tsx",
    "app\components\admin\GlobalConfigForm.tsx",
    "app\components\admin\StoreSettings.tsx",
    "app\api\og\route.tsx",
    "app\test-whatsapp\page.tsx"
)

$replacements = @{
    "OlinShop"                                                              = "LojaKy"
    "olinshop"                                                              = "lojaky"
    "OLINSHOP"                                                              = "LOJAKY"
    "© 2025 OlinShop Premium retail"                                        = "© 2026 Noviapp Mobile Apps • LojaKy®"
    "© 2025 Noviapp Mobile Apps • www.noviapp.com.br • OlindAki & OlinShop" = "© 2026 Noviapp Mobile Apps • LojaKy®"
    "olinshop.vercel.app"                                                   = "lojaky.noviapp.com.br"
    "OlinShop/1.0"                                                          = "LojaKy/1.0"
}

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $fullPath = "D:\Antigravity\olinshop\$file"
    
    if (Test-Path $fullPath) {
        Write-Host "📝 Processing: $file" -ForegroundColor Yellow
        
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        $originalContent = $content
        $fileReplacements = 0
        
        foreach ($old in $replacements.Keys) {
            $new = $replacements[$old]
            if ($content -match [regex]::Escape($old)) {
                $content = $content -replace [regex]::Escape($old), $new
                $count = ([regex]::Matches($originalContent, [regex]::Escape($old))).Count
                $fileReplacements += $count
                Write-Host "   ✅ Replaced '$old' → '$new' ($count times)" -ForegroundColor Green
            }
        }
        
        if ($fileReplacements -gt 0) {
            Set-Content $fullPath -Value $content -Encoding UTF8 -NoNewline
            $totalFiles++
            $totalReplacements += $fileReplacements
            Write-Host "   💾 Saved $file" -ForegroundColor Cyan
        }
        else {
            Write-Host "   ⏭️  No changes needed" -ForegroundColor Gray
        }
        
        Write-Host ""
    }
    else {
        Write-Host "⚠️  File not found: $file" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Rebranding Complete!" -ForegroundColor Green
Write-Host "📊 Files Updated: $totalFiles" -ForegroundColor Cyan
Write-Host "🔄 Total Replacements: $totalReplacements" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review changes: git diff" -ForegroundColor White
Write-Host "2. Test locally: npm run dev" -ForegroundColor White
Write-Host "3. Commit: git add . && git commit -m 'Complete LojaKy rebranding'" -ForegroundColor White
Write-Host "4. Deploy: git push origin main" -ForegroundColor White
