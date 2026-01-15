# Deployment script for Store Search & Reorder features

Write-Host "🚀 Deploying Store Search & Reorder..." -ForegroundColor Cyan

# Add changes
git add .

# Commit
git commit -m "feat: implement store-level search and 'Order Again' reordering feature"

# Push
git push origin main

Write-Host "✅ Changes pushed to GitHub!" -ForegroundColor Green

Write-Host "`n⚠️  IMPORTANT ACTION REQUIRED:" -ForegroundColor Yellow
Write-Host "After the build is finished on Vercel, visit the following URLs once to update your database schema:"
Write-Host "1. https://olindelivery.vercel.app/api/admin/setup?secret=olin-magic-123"
Write-Host "2. https://olinshop.vercel.app/api/admin/setup?secret=olin-magic-123"
Write-Host "(Replace the domains if yours are different)"
