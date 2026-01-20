Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           CALLING THE TEST URL NOW!" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$webhookUrl = "http://localhost:5678/webhook/whatsapp"

Write-Host "Testing webhook: $webhookUrl" -ForegroundColor Yellow
Write-Host ""

# Create test payload
$payload = @{
    body = @{
        payload = @{
            from = "5581999999999@c.us"
            body = "Teste automatico do webhook"
        }
    }
}

$jsonPayload = $payload | ConvertTo-Json -Depth 10

Write-Host "Sending test message..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $jsonPayload -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "           ✅ SUCCESS! WEBHOOK IS WORKING!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response received:" -ForegroundColor Cyan
    Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor White
    Write-Host ""
    Write-Host "NOW CHECK:" -ForegroundColor Yellow
    Write-Host "  1. Go to n8n: http://localhost:5678" -ForegroundColor White
    Write-Host "  2. Click 'Executions' in left sidebar" -ForegroundColor White
    Write-Host "  3. You should see the test execution!" -ForegroundColor White
    Write-Host ""
    Write-Host "  4. The workflow tried to send a WhatsApp message" -ForegroundColor White
    Write-Host "     Check if you received it!" -ForegroundColor White
    Write-Host ""
    
}
catch {
    $errorMessage = $_.Exception.Message
    
    if ($errorMessage -like "*404*" -or $errorMessage -like "*not registered*") {
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host "           ❌ WEBHOOK NOT ACTIVE YET" -ForegroundColor Red
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host ""
        Write-Host "The workflow is imported but NOT ACTIVATED." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "YOU NEED TO:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  1. In n8n, click the 'Save' button" -ForegroundColor White
        Write-Host ""
        Write-Host "  2. Click the TOGGLE SWITCH to turn it GREEN" -ForegroundColor White
        Write-Host "     (It's in the top right corner)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "  3. Once it's GREEN, run this script again:" -ForegroundColor White
        Write-Host "     .\call-test-url.ps1" -ForegroundColor Cyan
        Write-Host ""
        
    }
    elseif ($errorMessage -like "*connection*" -or $errorMessage -like "*refused*") {
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host "           ❌ N8N NOT ACCESSIBLE" -ForegroundColor Red
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host ""
        Write-Host "n8n is not running or not accessible." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "FIX:" -ForegroundColor Yellow
        Write-Host "  1. Check if n8n is running: docker ps" -ForegroundColor White
        Write-Host "  2. Restart n8n: docker-compose restart n8n" -ForegroundColor White
        Write-Host "  3. Try accessing: http://localhost:5678" -ForegroundColor White
        Write-Host ""
        
    }
    else {
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host "           ❌ ERROR" -ForegroundColor Red
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error: $errorMessage" -ForegroundColor Gray
        Write-Host ""
    }
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
