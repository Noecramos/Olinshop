$newPassword = "901e2f0478744deca51df47ed060ccff"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "        LATEST WAHA PASSWORD (After NOWEB Restart)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host ""
Write-Host "  👤 USERNAME:" -ForegroundColor Green
Write-Host ""
Write-Host "     admin" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host ""
Write-Host "  🔑 LATEST PASSWORD:" -ForegroundColor Green
Write-Host ""
Write-Host "     $newPassword" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Copying password to clipboard..." -ForegroundColor Yellow
Set-Clipboard -Value $newPassword
Write-Host ""
Write-Host "  ✅ PASSWORD COPIED!" -ForegroundColor Green
Write-Host ""
Write-Host "  Opening WAHA Dashboard..." -ForegroundColor Yellow
Start-Process "http://localhost:3000/dashboard"
Write-Host ""
Write-Host "  ✅ Dashboard opened!" -ForegroundColor Green
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  LOGIN STEPS:" -ForegroundColor Yellow
Write-Host "    1. Username: admin" -ForegroundColor White
Write-Host "    2. Password: Ctrl+V (already copied!)" -ForegroundColor White
Write-Host "    3. Click Login" -ForegroundColor White
Write-Host ""
Write-Host "  THEN CREATE SESSION:" -ForegroundColor Yellow
Write-Host "    1. Click '+ Add Session'" -ForegroundColor White
Write-Host "    2. Session Name: default" -ForegroundColor White
Write-Host "    3. Engine: NOWEB (important!)" -ForegroundColor White
Write-Host "    4. Click Create" -ForegroundColor White
Write-Host "    5. Scan QR Code with phone" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter when you've scanned the QR code"
