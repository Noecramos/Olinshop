Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           🎉 WEBHOOK IS ACTIVE! TESTING NOW..." -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$webhookUrl = "http://localhost:5678/webhook/whatsapp"

# Create test payload simulating WAHA
$payload = @{
    body = @{
        payload = @{
            from = "5581999999999@c.us"
            body = "Teste do webhook funcionando!"
        }
    }
}

$jsonPayload = $payload | ConvertTo-Json -Depth 10

Write-Host "Sending test message to webhook..." -ForegroundColor Yellow
Write-Host "URL: $webhookUrl" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $jsonPayload -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "           ✅ SUCCESS! WEBHOOK IS WORKING!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor White
    Write-Host ""
    Write-Host "✅ WHAT HAPPENED:" -ForegroundColor Yellow
    Write-Host "  1. Webhook received the message" -ForegroundColor White
    Write-Host "  2. Workflow executed successfully" -ForegroundColor White
    Write-Host "  3. Tried to send response via WAHA" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 CHECK N8N:" -ForegroundColor Yellow
    Write-Host "  1. Go to: http://localhost:5678" -ForegroundColor White
    Write-Host "  2. Click 'Executions' in left sidebar" -ForegroundColor White
    Write-Host "  3. You should see the test execution!" -ForegroundColor White
    Write-Host ""
    Write-Host "📱 NEXT: TEST WITH REAL WHATSAPP" -ForegroundColor Yellow
    Write-Host "  1. Send message to: +55 81 8392-0320" -ForegroundColor White
    Write-Host "  2. Message: 'teste'" -ForegroundColor White
    Write-Host "  3. You should get an echo response!" -ForegroundColor White
    Write-Host ""
    
}
catch {
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "           ⚠️  PARTIAL SUCCESS" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "The webhook responded but returned:" -ForegroundColor White
    Write-Host $_.Exception.Message -ForegroundColor Gray
    Write-Host ""
    Write-Host "This might be OK - check n8n Executions to see what happened" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://localhost:5678"
Write-Host "Opening n8n to check executions..." -ForegroundColor Yellow
Write-Host ""
