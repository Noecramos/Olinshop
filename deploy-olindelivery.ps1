# Deploy Olindelivery Password Reset Changes
Write-Host "Deploying Olindelivery Password Reset Feature..." -ForegroundColor Cyan
Write-Host ""

# Navigate to olindelivery
Set-Location "d:\Antigravity\olindelivery"

# Check git status
Write-Host "Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Adding files..." -ForegroundColor Yellow
git add app/api/admin/super-reset/route.ts
git add package.json
git add SUPER_ADMIN_PASSWORD_RESET.md

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Implement super admin password reset - Always sends to noecramos@gmail.com - Generates random password and saves to database - Includes email support with nodemailer - Falls back to alert if email not configured"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "Deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "Vercel will auto-deploy in 2-3 minutes" -ForegroundColor Cyan
Write-Host "Monitor at: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test at: https://olindelivery.vercel.app/admin/super" -ForegroundColor Cyan
Write-Host "Click Esqueci minha senha to test password reset" -ForegroundColor Gray
Write-Host ""
