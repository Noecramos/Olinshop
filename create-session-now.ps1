$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WAHA Fixed - Creating Session Now" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Waiting for WAHA to fully start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

$wahaUrl = "http://localhost:3000"
$sessionName = "default"
$webhookUrl = "http://n8n:5678/webhook/whatsapp"
$username = "admin"
$password = "d643bbc256e540c285c4189a1a7ca664"

$pair = "$($username):$($password)"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))
$headers = @{
    Authorization  = "Basic $encodedCreds"
    "Content-Type" = "application/json"
}

Write-Host "Creating 'default' session..." -ForegroundColor Yellow

$sessionBody = @{
    name = $sessionName
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$wahaUrl/api/sessions" -Method Post -Body $sessionBody -Headers $headers | Out-Null
    Write-Host "  Success: Session created!" -ForegroundColor Green
}
catch {
    Write-Host "  Info: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting session..." -ForegroundColor Yellow

try {
    Invoke-RestMethod -Uri "$wahaUrl/api/sessions/$sessionName/start" -Method Post -Headers $headers | Out-Null
    Write-Host "  Success: Session started!" -ForegroundColor Green
}
catch {
    Write-Host "  Info: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "           Opening Dashboard" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Start-Process "http://localhost:3000/dashboard"

Write-Host "Dashboard opened!" -ForegroundColor Green
Write-Host ""
Write-Host "NOW:" -ForegroundColor Yellow
Write-Host "  1. Find 'default' session in dashboard" -ForegroundColor White
Write-Host "  2. Click on it" -ForegroundColor White
Write-Host "  3. QR Code should appear!" -ForegroundColor White
Write-Host "  4. Scan with your phone" -ForegroundColor White
Write-Host ""
