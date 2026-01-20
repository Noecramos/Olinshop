# Script para Iniciar WAHA via SSH
# Execute este script para iniciar o servico WAHA automaticamente

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   INICIAR WAHA - WhatsApp AI Agent" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuracoes
$serverIP = "65.108.154.16"
$sshUser = "ubuntu"

# Solicitar caminho da chave SSH
Write-Host "Por favor, informe o caminho completo da sua chave SSH:" -ForegroundColor Yellow
Write-Host "Exemplo: C:\Users\SeuNome\Downloads\oracle-cloud-key.pem" -ForegroundColor Gray
Write-Host ""
$sshKeyPath = Read-Host "Caminho da chave SSH"

# Verificar se o arquivo existe
if (-not (Test-Path $sshKeyPath)) {
    Write-Host ""
    Write-Host "ERRO: Arquivo nao encontrado!" -ForegroundColor Red
    Write-Host "Caminho informado: $sshKeyPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Verifique se o caminho esta correto e tente novamente." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit
}

Write-Host ""
Write-Host "Chave SSH encontrada!" -ForegroundColor Green
Write-Host ""

# Comandos para executar no servidor
$commands = "docker start waha && sleep 3 && docker ps | grep waha"

Write-Host "Conectando ao servidor $serverIP..." -ForegroundColor Yellow
Write-Host ""

try {
    # Executar comandos via SSH
    $result = ssh -i "$sshKeyPath" -o StrictHostKeyChecking=no "$sshUser@$serverIP" "$commands" 2>&1
    
    Write-Host $result
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   VERIFICACAO FINAL" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Aguardar um pouco para o servico iniciar
    Write-Host "Aguardando WAHA inicializar..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Testar acesso ao WAHA
    Write-Host "Testando acesso ao WAHA Dashboard..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "http://$serverIP/dashboard" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        Write-Host " ONLINE" -ForegroundColor Green
        Write-Host ""
        Write-Host "SUCESSO! WAHA esta online e acessivel!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Proximos passos:" -ForegroundColor Yellow
        Write-Host "1. Acesse: http://$serverIP/dashboard" -ForegroundColor White
        Write-Host "2. Clique em 'Start Session' na sessao 'default'" -ForegroundColor White
        Write-Host "3. Escaneie o QR Code com WhatsApp Business (+55 81 8392-0320)" -ForegroundColor White
        Write-Host ""
        Write-Host "Consulte CONNECT_BUSINESS_WHATSAPP.md para instrucoes detalhadas" -ForegroundColor Cyan
        Write-Host ""
        
        # Perguntar se quer abrir o dashboard
        $openBrowser = Read-Host "Deseja abrir o WAHA Dashboard agora? (S/N)"
        if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
            Start-Process "http://$serverIP/dashboard"
        }
    }
    catch {
        Write-Host " OFFLINE" -ForegroundColor Red
        Write-Host ""
        Write-Host "WAHA ainda nao esta acessivel." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Possiveis causas:" -ForegroundColor Yellow
        Write-Host "- O container pode estar iniciando (aguarde 30 segundos e tente novamente)" -ForegroundColor White
        Write-Host "- Pode haver um erro no container (verifique os logs)" -ForegroundColor White
        Write-Host ""
        Write-Host "Para verificar logs:" -ForegroundColor Cyan
        Write-Host "ssh -i `"$sshKeyPath`" $sshUser@$serverIP" -ForegroundColor White
        Write-Host "docker logs waha" -ForegroundColor White
    }
}
catch {
    Write-Host ""
    Write-Host "ERRO ao conectar via SSH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Detalhes do erro:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Gray
    Write-Host ""
    Write-Host "Verifique:" -ForegroundColor Yellow
    Write-Host "1. A chave SSH esta correta" -ForegroundColor White
    Write-Host "2. Voce tem permissao para acessar o servidor" -ForegroundColor White
    Write-Host "3. O servidor esta online" -ForegroundColor White
    Write-Host "4. A porta 22 (SSH) esta aberta no firewall" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Pressione Enter para sair"
