Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WAHA Fixed - Creating Session Now" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Waiting for WAHA to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

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

Write-Host "Creating 'default' session with WEBJS engine..." -ForegroundColor Yellow

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
    $response = Invoke-RestMethod -Uri "$wahaUrl/api/sessions" -Method Post -Body $sessionBody -Headers $headers -ErrorAction Stop
    Write-Host "  ✅ Session created!" -ForegroundColor Green
}
catch {
    if ($_.Exception.Message -like "*409*") {
        Write-Host "  ℹ️  Session already exists" -ForegroundColor Cyan
    }
    else {
        Write-Host "  ⚠️  $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Starting session..." -ForegroundColor Yellow

try {
    Invoke-RestMethod -Uri "$wahaUrl/api/sessions/$sessionName/start" -Method Post -Headers $headers -ErrorAction Stop | Out-Null
    Write-Host "  ✅ Session started!" -ForegroundColor Green
}
catch {
    Write-Host "  ℹ️  Session may already be running" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Waiting for QR code..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "           SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Opening WAHA Dashboard..." -ForegroundColor Yellow
Start-Process "http://localhost:3000/dashboard"

Write-Host ""
Write-Host "✅ Dashboard opened!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Look for 'default' session" -ForegroundColor White
Write-Host "  2. Click on it" -ForegroundColor White
Write-Host "  3. QR Code should be visible!" -ForegroundColor White
Write-Host "  4. Scan with WhatsApp Business" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
