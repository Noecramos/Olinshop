# Test n8n Webhook
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           TESTING N8N WEBHOOK" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$webhookUrl = "http://localhost:5678/webhook/whatsapp"

Write-Host "Testing webhook at: $webhookUrl" -ForegroundColor Yellow
Write-Host ""

# Create test payload (simulating WAHA message)
$testPayload = @{
    body = @{
        payload = @{
            from = "5581999999999@c.us"
            body = "Olá, teste do webhook"
        }
    }
} | ConvertTo-Json -Depth 10

Write-Host "Sending test message..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $testPayload -ContentType "application/json" -ErrorAction Stop
    
    Write-Host ""
    Write-Host "✅ SUCCESS! Webhook responded!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
    Write-Host "Now check:" -ForegroundColor Yellow
    Write-Host "1. Go to n8n: http://localhost:5678" -ForegroundColor White
    Write-Host "2. Click 'Executions' in left sidebar" -ForegroundColor White
    Write-Host "3. You should see a new execution!" -ForegroundColor White
    
}
catch {
    Write-Host ""
    Write-Host "❌ Webhook test failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "This might mean:" -ForegroundColor Yellow
    Write-Host "1. Workflow is not active (toggle must be GREEN)" -ForegroundColor White
    Write-Host "2. Workflow is not saved" -ForegroundColor White
    Write-Host "3. n8n is not running" -ForegroundColor White
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
