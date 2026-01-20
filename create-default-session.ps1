# Create WAHA Default Session
$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Creating 'default' Session in WAHA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
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

Write-Host "Step 1: Creating session 'default'..." -ForegroundColor Yellow

$sessionBody = @{
    name   = $sessionName
    config = @{
        webhooks = @(
            @{
                url    = $webhookUrl
                events = @("message", "message.any", "session.status")
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$wahaUrl/api/sessions" -Method Post -Body $sessionBody -Headers $headers
    Write-Host "  ✅ Session created successfully!" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "  ⚠️  $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Step 2: Starting session..." -ForegroundColor Yellow

try {
    Invoke-RestMethod -Uri "$wahaUrl/api/sessions/$sessionName/start" -Method Post -Headers $headers | Out-Null
    Write-Host "  ✅ Session started!" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "  ⚠️  $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Step 3: Waiting for QR code..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "  ✅ Session should be ready!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           Opening Dashboard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://localhost:3000/dashboard"

Write-Host "✅ Dashboard opened!" -ForegroundColor Green
Write-Host ""
Write-Host "NOW:" -ForegroundColor Yellow
Write-Host "  1. Look for 'default' session in left sidebar" -ForegroundColor White
Write-Host "  2. Click on it" -ForegroundColor White
Write-Host "  3. QR Code should appear!" -ForegroundColor White
Write-Host "  4. Scan it with your phone" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
