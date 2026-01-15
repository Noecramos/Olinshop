# Deploy Olindelivery - Fix Super Admin Login
Write-Host "Deploying Super Admin Login Fix..." -ForegroundColor Cyan
Write-Host ""

# Navigate to olindelivery
Set-Location "d:\Antigravity\olindelivery"

Write-Host "Adding files..." -ForegroundColor Yellow
git add app/api/admin/verify-super/route.ts
git add app/api/admin/super-reset/route.ts
git add app/admin/[slug]/page.tsx
git add app/api/restaurants/route.ts
git add RESTAURANT_APPROVAL_FIX.md

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "fix: Super admin login now checks database password first - Allows password reset to work properly - Falls back to environment variable if no DB password - Includes restaurant approval filtering"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "Deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "Vercel will auto-deploy in 2-3 minutes" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test login with password: ygpkc7kuaf" -ForegroundColor Yellow
Write-Host ""
