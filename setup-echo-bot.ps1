Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "     ULTRA SIMPLE ECHO BOT - LET'S GET THIS WORKING!" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "I've created the SIMPLEST possible workflow:" -ForegroundColor Yellow
Write-Host "  - Just 2 nodes (Webhook → Send Response)" -ForegroundColor White
Write-Host "  - No AI, no database, no complexity" -ForegroundColor White
Write-Host "  - Just echoes back your message" -ForegroundColor White
Write-Host ""

Write-Host "Opening n8n..." -ForegroundColor Yellow
Start-Process "http://localhost:5678"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                 IMPORT THE ECHO BOT" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "In n8n (just opened):" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Click ⋮ (three dots) → 'Import from File'" -ForegroundColor White
Write-Host ""
Write-Host "  2. Select this file:" -ForegroundColor White
Write-Host "     d:\Antigravity\olinshop\workflow-echo.json" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Click 'Save'" -ForegroundColor White
Write-Host ""
Write-Host "  4. Toggle to GREEN (active)" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                 TEST IT" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Send WhatsApp message to: +55 81 8392-0320" -ForegroundColor Yellow
Write-Host "Message: teste" -ForegroundColor White
Write-Host ""
Write-Host "Expected response:" -ForegroundColor Yellow
Write-Host "  'Olá! Recebi sua mensagem: teste'" -ForegroundColor Green
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Full guide: SIMPLE-SETUP.md" -ForegroundColor Gray
Write-Host ""

Read-Host "Press Enter when you've imported the workflow"

Write-Host ""
Write-Host "Testing the webhook..." -ForegroundColor Yellow

$testPayload = @{
    body = @{
        payload = @{
            from = "5581999999999@c.us"
            body = "teste automatico"
        }
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5678/webhook/whatsapp" -Method Post -Body $testPayload -ContentType "application/json"
    Write-Host "✅ Webhook is working!" -ForegroundColor Green
    Write-Host "Check n8n Executions to see the test" -ForegroundColor White
}
catch {
    Write-Host "❌ Webhook test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure workflow is ACTIVE (green toggle)" -ForegroundColor Yellow
}

Write-Host ""
