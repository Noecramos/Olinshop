# OlinDelivery - Fix Favicon and Deploy
Write-Host "Updating OlinDelivery Favicon configuration..." -ForegroundColor Cyan

# Navigate to olindelivery
Set-Location "d:\Antigravity\olindelivery"

Write-Host "Adding modified layout.tsx and removing old favicon.ico..." -ForegroundColor Yellow
git add app/layout.tsx
# Using force on rm if it was untracked or ignoring errors if it doesn't exist
git rm app/favicon.ico --ignore-unmatch

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "style: Use custom OlinDelivery logo as favicon and remove default Vercel/Next icon"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Favicon update pushed! Vercel will deploy shortly." -ForegroundColor Green
