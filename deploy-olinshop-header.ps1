# OlinShop - Marketplace Header Unification
Write-Host "Unifying Shop Header with Marketplace Branding..." -ForegroundColor Cyan

# Navigate to olinshop
Set-Location "d:\Antigravity\olinshop"

Write-Host "Adding modified files..." -ForegroundColor Yellow
git add app/components/StoreHeader.tsx

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "fix: Unify Shop header with Marketplace branding

- Added sticky marketplace top bar to StoreHeader
- Removed shop banner image for a cleaner, consistent look
- Integrated auth-aware Login/Profile button"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ OlinShop header alignment pushed!" -ForegroundColor Green
