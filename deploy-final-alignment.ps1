# OlinDelivery - Final Clean Revert & Marketplace Alignment
Write-Host "Aligning Restaurant Header with Marketplace and restoring Original UI..." -ForegroundColor Cyan

# Navigate to olindelivery
Set-Location "d:\Antigravity\olindelivery"

Write-Host "Adding modified files..." -ForegroundColor Yellow
git add app/page.tsx
git add app/components/RestaurantHeader.tsx

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "fix: Unified headers and restored clean UI as requested

- Removed extra logos from Marketplace and Restaurant headers
- Restored original Splash Screen bounce animation and sizing
- Aligned Restaurant Header height (h-56) and layout with the Marketplace header"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Deployment complete! The headers are now identical and extra logos have been removed." -ForegroundColor Green
