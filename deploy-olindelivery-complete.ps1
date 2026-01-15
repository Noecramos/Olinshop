# OlinDelivery - Deploy Favicon and Logo Updates
Write-Host "Deploying OlinDelivery Favicon and Logo..." -ForegroundColor Cyan
Write-Host ""

# Navigate to olindelivery
Set-Location "d:\Antigravity\olindelivery"

# Logo URL
$logoUrl = "https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/olindelivery-favicon.jpg"

Write-Host "Logo URL: $logoUrl" -ForegroundColor Green
Write-Host ""

# Check if layout.tsx exists
$layoutPath = "app\layout.tsx"
if (Test-Path $layoutPath) {
    Write-Host "Found layout.tsx - Please manually add favicon to metadata" -ForegroundColor Yellow
    Write-Host "Add this to metadata:" -ForegroundColor Gray
    Write-Host "  icons: { icon: '$logoUrl' }" -ForegroundColor Gray
}
else {
    Write-Host "layout.tsx not found - will need to create it" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Adding modified files..." -ForegroundColor Yellow
git add app/api/admin/super-reset/route.ts
git add app/api/admin/verify-super/route.ts
git add app/admin/[slug]/page.tsx
git add app/api/restaurants/route.ts
git add RESTAURANT_APPROVAL_FIX.md
git add upload-favicon.mjs

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Add OlinDelivery logo support and fix email/password reset

- Uploaded logo to Vercel Blob
- Updated password reset to use Resend API
- Fixed super admin login to check database
- Added restaurant approval filtering
- Logo URL: $logoUrl"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "Deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "Vercel will auto-deploy in 2-3 minutes" -ForegroundColor Cyan
Write-Host ""
Write-Host "Logo URL (save this):" -ForegroundColor Yellow
Write-Host "$logoUrl" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add favicon to app/layout.tsx metadata" -ForegroundColor Gray
Write-Host "2. Or create app/icon.png with the logo" -ForegroundColor Gray
Write-Host ""
