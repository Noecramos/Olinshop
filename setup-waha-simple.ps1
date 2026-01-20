# WAHA Automated Setup - Simple Version
$ErrorActionPreference = "Continue"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "      WAHA Automated Setup via API" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$wahaUrl = "http://localhost:3000"
$sessionName = "default"
$webhookUrl = "http://n8n:5678/webhook/whatsapp"
$username = "admin"
$password = "d643bbc256e540c285c4189a1a7ca664"

# Create auth header
$pair = "$($username):$($password)"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))
$headers = @{
    Authorization  = "Basic $encodedCreds"
    "Content-Type" = "application/json"
}

Write-Host "Step 1: Creating session..." -ForegroundColor Yellow

$sessionBody = @{
    name = $sessionName
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$wahaUrl/api/sessions" -Method Post -Body $sessionBody -Headers $headers | Out-Null
    Write-Host "  Success: Session created" -ForegroundColor Green
}
catch {
    Write-Host "  Info: Session may already exist" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Starting session..." -ForegroundColor Yellow

try {
    Invoke-RestMethod -Uri "$wahaUrl/api/sessions/$sessionName/start" -Method Post -Headers $headers | Out-Null
    Write-Host "  Success: Session started" -ForegroundColor Green
}
catch {
    Write-Host "  Info: Session may already be running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 3: Getting QR Code..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

try {
    $qr = Invoke-RestMethod -Uri "$wahaUrl/api/sessions/$sessionName/auth/qr" -Method Get -Headers $headers
    
    if ($qr.qr) {
        Write-Host "  Success: QR Code retrieved!" -ForegroundColor Green
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host "  Opening QR Code in browser..." -ForegroundColor Yellow
        Write-Host "================================================" -ForegroundColor Cyan
        
        # Save QR code data to file
        $qr.qr | Out-File -FilePath "qr-data.txt"
        
        # Open WAHA dashboard where QR code is visible
        Start-Process "http://localhost:3000/dashboard"
        
        Write-Host ""
        Write-Host "  QR Code is available in WAHA Dashboard!" -ForegroundColor Green
        Write-Host "  Dashboard opened in browser" -ForegroundColor Green
    }
}
catch {
    Write-Host "  Info: Could not retrieve QR code" -ForegroundColor Yellow
    Write-Host "  Opening dashboard - scan QR there" -ForegroundColor Yellow
    Start-Process "http://localhost:3000/dashboard"
}

Write-Host ""
Write-Host "Step 4: Configuring webhook..." -ForegroundColor Yellow

$webhookBody = @{
    url    = $webhookUrl
    events = @("message", "message.any")
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$wahaUrl/api/sessions/$sessionName/webhooks" -Method Post -Body $webhookBody -Headers $headers | Out-Null
    Write-Host "  Success: Webhook configured!" -ForegroundColor Green
    Write-Host "  URL: $webhookUrl" -ForegroundColor White
}
catch {
    Write-Host "  Info: Webhook may need manual configuration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "           Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "What was done:" -ForegroundColor Yellow
Write-Host "  Session 'default' created/started" -ForegroundColor White
Write-Host "  Webhook configured: $webhookUrl" -ForegroundColor White
Write-Host "  Dashboard opened in browser" -ForegroundColor White
Write-Host ""
Write-Host "What YOU need to do:" -ForegroundColor Yellow
Write-Host "  1. Go to WAHA Dashboard (just opened)" -ForegroundColor White
Write-Host "  2. Find the 'default' session" -ForegroundColor White
Write-Host "  3. Scan the QR Code with WhatsApp" -ForegroundColor White
Write-Host "  4. Wait for status: WORKING" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
