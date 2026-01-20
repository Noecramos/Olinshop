Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WAHA Fixed - NOWEB Engine" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Waiting for WAHA to start with NOWEB engine..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

$wahaUrl = "http://localhost:3000"
$sessionName = "default"
$username = "admin"
$password = "59100d817a5f43c1a4efc3f0c3b555ab"

$pair = "$($username):$($password)"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))
$headers = @{
    Authorization  = "Basic $encodedCreds"
    "Content-Type" = "application/json"
}

Write-Host "Creating session with NOWEB engine..." -ForegroundColor Yellow

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
Write-Host "           SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Opening WAHA Dashboard..." -ForegroundColor Yellow
Start-Process "http://localhost:3000/dashboard"

Write-Host ""
Write-Host "Dashboard opened!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Yellow
Write-Host "  Engine changed to: NOWEB" -ForegroundColor White
Write-Host "  (NOWEB doesn't need Chrome - more reliable!)" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT:" -ForegroundColor Yellow
Write-Host "  1. Login with password: 59100d817a5f43c1a4efc3f0c3b555ab" -ForegroundColor White
Write-Host "  2. Find 'default' session" -ForegroundColor White
Write-Host "  3. Click on it" -ForegroundColor White
Write-Host "  4. QR Code should appear!" -ForegroundColor White
Write-Host "  5. Scan with WhatsApp" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
