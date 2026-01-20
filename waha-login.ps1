# WAHA Login Helper
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          WAHA LOGIN CREDENTIALS                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$username = "admin"
$password = "d643bbc256e540c285c4189a1a7ca664"

Write-Host "🌐 WAHA Dashboard URL:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000/dashboard" -ForegroundColor White
Write-Host ""

Write-Host "🔑 Login Credentials:" -ForegroundColor Yellow
Write-Host "   Username: $username" -ForegroundColor White
Write-Host "   Password: $password" -ForegroundColor White
Write-Host ""

Write-Host "📋 What would you like to do?" -ForegroundColor Yellow
Write-Host "   1. Copy username to clipboard" -ForegroundColor White
Write-Host "   2. Copy password to clipboard" -ForegroundColor White
Write-Host "   3. Open WAHA Dashboard" -ForegroundColor White
Write-Host "   4. Copy both and open dashboard" -ForegroundColor White
Write-Host "   5. Show credentials only" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Set-Clipboard -Value $username
        Write-Host "✅ Username copied to clipboard!" -ForegroundColor Green
        Write-Host "   Paste it in the username field" -ForegroundColor White
    }
    "2" {
        Set-Clipboard -Value $password
        Write-Host "✅ Password copied to clipboard!" -ForegroundColor Green
        Write-Host "   Paste it in the password field" -ForegroundColor White
    }
    "3" {
        Write-Host "🌐 Opening WAHA Dashboard..." -ForegroundColor Green
        Start-Process "http://localhost:3000/dashboard"
        Write-Host ""
        Write-Host "Use these credentials:" -ForegroundColor Yellow
        Write-Host "Username: $username" -ForegroundColor White
        Write-Host "Password: $password" -ForegroundColor White
    }
    "4" {
        Write-Host "📋 Copying credentials and opening dashboard..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Step 1: Username copied to clipboard!" -ForegroundColor Green
        Set-Clipboard -Value $username
        Start-Sleep -Seconds 2
        
        Write-Host "Step 2: Opening dashboard..." -ForegroundColor Green
        Start-Process "http://localhost:3000/dashboard"
        Start-Sleep -Seconds 3
        
        Write-Host "Step 3: Now copying password to clipboard!" -ForegroundColor Green
        Set-Clipboard -Value $password
        Write-Host ""
        Write-Host "✅ Password is now in your clipboard - paste it!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Login steps:" -ForegroundColor Yellow
        Write-Host "1. Enter username: admin (or paste from clipboard)" -ForegroundColor White
        Write-Host "2. Paste password: Ctrl+V" -ForegroundColor White
        Write-Host "3. Click Login" -ForegroundColor White
    }
    "5" {
        Write-Host "✅ Credentials displayed above" -ForegroundColor Green
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Credentials saved in: WAHA_LOGIN_CREDENTIALS.txt" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
