# OlinDelivery - Final Branding Deploy
Write-Host "Deploying final branding updates including manifest.json..." -ForegroundColor Cyan

# Navigate to olindelivery
Set-Location "d:\Antigravity\olindelivery"

Write-Host "Adding manifest.json..." -ForegroundColor Yellow
git add public/manifest.json

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Update PWA manifest with new OlinDelivery logo"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Final branding update pushed!" -ForegroundColor Green
