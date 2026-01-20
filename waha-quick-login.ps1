# Quick WAHA Login - Auto Copy Password
$password = "d643bbc256e540c285c4189a1a7ca664"

Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          WAHA LOGIN - QUICK ACCESS                       ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Password copied to clipboard!" -ForegroundColor Green
Set-Clipboard -Value $password

Write-Host "🌐 Opening WAHA Dashboard..." -ForegroundColor Yellow
Start-Process "http://localhost:3000/dashboard"

Write-Host ""
Write-Host "📋 LOGIN INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "   1. Username: admin" -ForegroundColor White
Write-Host "   2. Password: Ctrl+V (already in clipboard!)" -ForegroundColor Green
Write-Host "   3. Click Login" -ForegroundColor White
Write-Host ""
Write-Host "Full password: $password" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
