# Script para verificar status dos serviços n8n e WAHA
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   N8N AI AGENT - STATUS CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$serverIP = "65.108.154.16"

Write-Host "Verificando serviços no servidor $serverIP" -ForegroundColor Yellow
Write-Host ""

# Testar n8n
Write-Host "Testando n8n..." -NoNewline
try {
    $null = Invoke-WebRequest -Uri "http://$serverIP:5678" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host " ONLINE" -ForegroundColor Green
    $n8nOnline = $true
}
catch {
    Write-Host " OFFLINE" -ForegroundColor Red
    $n8nOnline = $false
}

# Testar WAHA Dashboard
Write-Host "Testando WAHA Dashboard..." -NoNewline
try {
    $null = Invoke-WebRequest -Uri "http://$serverIP/dashboard" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host " ONLINE" -ForegroundColor Green
    $wahaOnline = $true
}
catch {
    Write-Host " OFFLINE" -ForegroundColor Red
    $wahaOnline = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RESUMO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($n8nOnline) {
    Write-Host "[OK] n8n: http://$serverIP:5678" -ForegroundColor Green
} else {
    Write-Host "[ERRO] n8n nao esta acessivel" -ForegroundColor Red
}

if ($wahaOnline) {
    Write-Host "[OK] WAHA: http://$serverIP/dashboard" -ForegroundColor Green
} else {
    Write-Host "[ERRO] WAHA nao esta acessivel" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PROXIMOS PASSOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($n8nOnline -and $wahaOnline) {
    Write-Host "Todos os servicos estao online!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Continue com:" -ForegroundColor Yellow
    Write-Host "1. Acesse n8n: http://$serverIP:5678" -ForegroundColor White
    Write-Host "2. Importe: n8n_agent_klingon.json" -ForegroundColor White
    Write-Host "3. Configure credenciais (veja credenciais_n8n.txt)" -ForegroundColor White
    Write-Host "4. Conecte WhatsApp no WAHA" -ForegroundColor White
    Write-Host ""
    Write-Host "Veja N8N_AI_AGENT_SETUP.md para detalhes" -ForegroundColor Cyan
} else {
    Write-Host "Alguns servicos estao offline!" -ForegroundColor Yellow
    Write-Host "Conecte via SSH e inicie os containers" -ForegroundColor Yellow
}

Write-Host ""
