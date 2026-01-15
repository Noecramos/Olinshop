# OlinDelivery - Clean Branding Fix
Write-Host "Deploying clean branding and header unification..." -ForegroundColor Cyan

# Navigate to olindelivery
Set-Location "d:\Antigravity\olindelivery"

Write-Host "Adding modified files..." -ForegroundColor Yellow
git add app/page.tsx
git add app/components/RestaurantHeader.tsx
git rm app/components/MainHeader.tsx --ignore-unmatch

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "fix: Restore original clean UI and unify headers correctly

- Restored Home Page layout with branded logo in header
- Optimized Splash Screen with centered pulsing logo
- Added matching Marketplace Top Bar to all restaurant pages
- Removed redundant MainHeader component"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Clean branding update pushed!" -ForegroundColor Green
