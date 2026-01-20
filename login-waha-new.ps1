$password = "59100d817a5f43c1a4efc3f0c3b555ab"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           NEW WAHA PASSWORD - AFTER RESTART" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host ""
Write-Host "  👤 USERNAME:" -ForegroundColor Green
Write-Host ""
Write-Host "     admin" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host ""
Write-Host "  🔑 NEW PASSWORD:" -ForegroundColor Green
Write-Host ""
Write-Host "     $password" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Copying password to clipboard..." -ForegroundColor Yellow
Set-Clipboard -Value $password
Write-Host ""
Write-Host "  ✅ PASSWORD COPIED! Press Ctrl+V to paste" -ForegroundColor Green
Write-Host ""
Write-Host "  Opening WAHA Dashboard..." -ForegroundColor Yellow
Start-Process "http://localhost:3000/dashboard"
Write-Host ""
Write-Host "  ✅ Dashboard opened!" -ForegroundColor Green
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  LOGIN NOW:" -ForegroundColor Yellow
Write-Host "    1. Username: admin" -ForegroundColor White
Write-Host "    2. Password: Ctrl+V (already copied!)" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
