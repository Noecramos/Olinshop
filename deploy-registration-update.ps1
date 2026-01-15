# OlinShop - Update Registration Field
Write-Host "Updating OlinShop Registration Field..." -ForegroundColor Cyan

# Navigate to olinshop
Set-Location "d:\Antigravity\olinshop"

Write-Host "Adding modified files..." -ForegroundColor Yellow
git add app/register/page.tsx

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "fix: Update default shop type to Moda & Acessórios in registration form"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Registration field update pushed!" -ForegroundColor Green
