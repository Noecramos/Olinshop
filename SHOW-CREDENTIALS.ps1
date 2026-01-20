Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           WAHA LOGIN - COPY THESE CREDENTIALS             " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host ""
Write-Host "  🌐 URL: http://localhost:3000/dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Host ""
Write-Host "  👤 USERNAME:" -ForegroundColor Green
Write-Host ""
Write-Host "     admin" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host ""
Write-Host "  🔑 PASSWORD:" -ForegroundColor Green
Write-Host ""
Write-Host "     d643bbc256e540c285c4189a1a7ca664" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📋 Press any key to copy password to clipboard..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Set-Clipboard -Value "d643bbc256e540c285c4189a1a7ca664"
Write-Host ""
Write-Host "  ✅ PASSWORD COPIED! Press Ctrl+V to paste it" -ForegroundColor Green
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close"
