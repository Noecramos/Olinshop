# OlinDelivery - Revert Messed Up Header Changes
Write-Host "Reverting header changes to stable state..." -ForegroundColor Cyan

# Navigate to olindelivery
Set-Location "d:\Antigravity\olindelivery"

# Revert files to commit 008a39f (before unified header refactor)
Write-Host "Reverting files..." -ForegroundColor Yellow
git checkout 008a39f -- app/page.tsx app/loja/[slug]/page.tsx app/components/RestaurantHeader.tsx
# Remove the new component
if (Test-Path "app/components/MainHeader.tsx") {
    Remove-Item "app/components/MainHeader.tsx"
}

Write-Host ""
Write-Host "Committing revert..." -ForegroundColor Yellow
git commit -m "revert: Reverting unified header changes that caused UI issues"

Write-Host ""
Write-Host "Pushing revert..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Revert complete. Vercel is redeploying the original UI." -ForegroundColor Green
