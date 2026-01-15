# OlinDelivery - Unified Header Deployment
Write-Host "Unified Header Deployment..." -ForegroundColor Cyan

# Navigate to olindelivery
Set-Location "d:\Antigravity\olindelivery"

Write-Host "Adding all modified files for unified header..." -ForegroundColor Yellow
git add app/components/MainHeader.tsx
git add app/page.tsx
git add app/loja/[slug]/page.tsx
git add app/components/RestaurantHeader.tsx

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Unified Marketplace Header across Home and Store pages
- Created reusable MainHeader component with sticky design and rounded footer
- Added MainHeader to restaurant pages as requested
- Compactified RestaurantHeader to fit below the new shared header"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Unified Header deployment pushed!" -ForegroundColor Green
