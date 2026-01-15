# Script para verificar status dos serviços n8n e WAHA
# Execute este script para verificar se tudo está funcionando

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   N8N AI AGENT - STATUS CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$serverIP = "65.108.154.16"

# Função para testar conectividade
function Test-Service {
    param(
        [string]$Name,
        [string]$Url
    )
    
    Write-Host "Testando $Name..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host " ✓ ONLINE" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host " ✗ OFFLINE" -ForegroundColor Red
        return $false
    }
}

Write-Host "1. Verificando serviços no servidor $serverIP" -ForegroundColor Yellow
Write-Host ""

# Testar n8n
$n8nOnline = Test-Service -Name "n8n" -Url "http://$serverIP:5678"

# Testar WAHA Dashboard
$wahaDashboardOnline = Test-Service -Name "WAHA Dashboard" -Url "http://$serverIP/dashboard"

# Testar WAHA API
$wahaApiOnline = Test-Service -Name "WAHA API" -Url "http://$serverIP/api"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RESUMO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($n8nOnline) {
    Write-Host "✓ n8n está acessível em: http://$serverIP:5678" -ForegroundColor Green
} else {
    Write-Host "✗ n8n NÃO está acessível" -ForegroundColor Red
    Write-Host "  Solução: Conecte via SSH e execute: docker start n8n" -ForegroundColor Yellow
}

if ($wahaDashboardOnline) {
    Write-Host "✓ WAHA Dashboard está acessível em: http://$serverIP/dashboard" -ForegroundColor Green
} else {
    Write-Host "✗ WAHA Dashboard NÃO está acessível" -ForegroundColor Red
    Write-Host "  Solução: Conecte via SSH e execute: docker start waha" -ForegroundColor Yellow
}

if ($wahaApiOnline) {
    Write-Host "✓ WAHA API está acessível em: http://$serverIP/api" -ForegroundColor Green
} else {
    Write-Host "✗ WAHA API NÃO está acessível" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PRÓXIMOS PASSOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($n8nOnline -and $wahaDashboardOnline) {
    Write-Host "✓ Todos os serviços estão online!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Continue com os seguintes passos:" -ForegroundColor Yellow
    Write-Host "1. Acesse n8n: http://$serverIP:5678" -ForegroundColor White
    Write-Host "2. Importe o workflow: n8n_agent_klingon.json" -ForegroundColor White
    Write-Host "3. Configure as credenciais (veja credenciais_n8n.txt)" -ForegroundColor White
    Write-Host "4. Acesse WAHA: http://$serverIP/dashboard" -ForegroundColor White
    Write-Host "5. Conecte o WhatsApp escaneando o QR Code" -ForegroundColor White
    Write-Host "6. Configure o webhook do WAHA para o n8n" -ForegroundColor White
    Write-Host ""
    Write-Host "Consulte N8N_AI_AGENT_SETUP.md para instruções detalhadas" -ForegroundColor Cyan
} else {
    Write-Host "⚠ Alguns serviços estão offline!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Você precisa:" -ForegroundColor Yellow
    Write-Host "1. Conectar ao servidor via SSH" -ForegroundColor White
    Write-Host "2. Iniciar os containers Docker que estão offline" -ForegroundColor White
    Write-Host ""
    Write-Host "Comando SSH (exemplo):" -ForegroundColor Cyan
    Write-Host "ssh -i caminho/para/chave.pem ubuntu@$serverIP" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   INFORMAÇÕES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Servidor: $serverIP" -ForegroundColor White
Write-Host "WhatsApp: +55 81 8392-0320" -ForegroundColor White
Write-Host "Workflow: n8n_agent_klingon.json" -ForegroundColor White
Write-Host "Credenciais: credenciais_n8n.txt" -ForegroundColor White
Write-Host "Guia completo: N8N_AI_AGENT_SETUP.md" -ForegroundColor White
Write-Host ""
