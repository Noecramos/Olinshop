# OlinDelivery - Complete Logo Deployment
Write-Host "Deploying OlinDelivery Logo to all pages, emails, and social sharing..." -ForegroundColor Cyan

# Navigate to olindelivery
Set-Location "d:\Antigravity\olindelivery"

Write-Host "Adding all modified files..." -ForegroundColor Yellow
git add app/layout.tsx
git add app/page.tsx
git add app/api/admin/super-reset/route.ts

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Full branding update with new OlinDelivery logo
- Updated Favicon and Apple Home Screen icon
- Added OpenGraph and Twitter metadata for WhatsApp/Social sharing
- Updated Splash Screen logo on main page
- Added logo to Super Admin password reset emails"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Complete branding deployment pushed! Vercel will auto-update everything." -ForegroundColor Green
Write-Host "💡 Note: It may take a few minutes for Vercel to build and for browsers to clear their favicon cache." -ForegroundColor White
