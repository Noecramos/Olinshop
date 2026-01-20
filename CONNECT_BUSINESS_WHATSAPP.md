# 📱 Conectar WhatsApp Business ao AI Agent - Guia Completo

**Data**: 19/01/2026  
**Objetivo**: Conectar seu WhatsApp Business ao agente de IA n8n/WAHA

---

## 🎯 Visão Geral

Este guia vai te ajudar a conectar seu WhatsApp Business ao sistema de IA para atendimento automático de clientes.

### O que você vai fazer:
1. ✅ Verificar/Iniciar os serviços (n8n e WAHA)
2. ✅ Acessar o WAHA Dashboard
3. ✅ Conectar seu WhatsApp Business via QR Code
4. ✅ Configurar o webhook para o n8n
5. ✅ Testar o agente de IA

---

## 📋 Pré-requisitos

Antes de começar, você precisa:

- [ ] Número do WhatsApp Business: **+55 81 8392-0320**
- [ ] Acesso ao celular com WhatsApp instalado
- [ ] Chave SSH do servidor Oracle Cloud (arquivo `.pem` ou `.key`)
- [ ] Servidor Oracle Cloud: **65.108.154.16**

---

## 🚀 PASSO 1: Iniciar os Serviços (n8n e WAHA)

### Opção A: Via Navegador (Mais Fácil)

1. **Teste se os serviços já estão online**:
   - Abra: http://65.108.154.16:5678 (n8n)
   - Abra: http://65.108.154.16/dashboard (WAHA)

2. **Se ambos abrirem**: Pule para o **PASSO 2** ✅

3. **Se não abrirem**: Continue com a Opção B abaixo

### Opção B: Via SSH (Se os serviços estiverem offline)

#### 1.1 Conectar ao Servidor

Abra o **PowerShell** ou **CMD** e execute:

```powershell
# Substitua o caminho pela localização da sua chave SSH
ssh -i "C:\caminho\para\sua\chave.pem" ubuntu@65.108.154.16
```

**Exemplos de onde a chave pode estar**:
- `C:\Users\SeuNome\Downloads\oracle-cloud-key.pem`
- `C:\Users\SeuNome\Documents\SSH\oracle-key.pem`
- `D:\Keys\oracle-vm-key.pem`

**Problemas comuns**:
- Se der erro de permissão no Windows, use: `icacls "caminho\chave.pem" /inheritance:r /grant:r "%username%:R"`
- Se não encontrar a chave, verifique no Oracle Cloud Console onde você baixou

#### 1.2 Verificar Containers Docker

Depois de conectado via SSH, execute:

```bash
docker ps -a
```

Você verá algo como:
```
CONTAINER ID   IMAGE              STATUS
abc123...      n8nio/n8n          Exited (0) 2 days ago
def456...      devlikeapro/waha   Exited (0) 2 days ago
```

#### 1.3 Iniciar os Serviços

```bash
# Iniciar ambos os serviços
docker start n8n waha

# Verificar se subiram
docker ps
```

Agora você deve ver:
```
CONTAINER ID   IMAGE              STATUS          PORTS
abc123...      n8nio/n8n          Up 5 seconds    0.0.0.0:5678->5678/tcp
def456...      devlikeapro/waha   Up 5 seconds    0.0.0.0:80->3000/tcp
```

#### 1.4 Sair do SSH

```bash
exit
```

---

## 📱 PASSO 2: Acessar o WAHA Dashboard

1. **Abra seu navegador** e acesse:
   ```
   http://65.108.154.16/dashboard
   ```

2. **Você verá o WAHA Dashboard** com uma interface similar a esta:
   - Lista de sessões
   - Botões para iniciar/parar sessões
   - Status de conexão

---

## 🔗 PASSO 3: Conectar seu WhatsApp Business

### 3.1 Criar/Iniciar Sessão

1. **Procure pela sessão chamada "default"**
   - Se não existir, clique em **"Add Session"** ou **"+"**
   - Nome da sessão: `default`

2. **Clique em "Start Session"** ou **"Start"**

3. **Aguarde alguns segundos** até aparecer o QR Code

### 3.2 Escanear QR Code

1. **No seu celular**, abra o WhatsApp Business
   
2. **Vá em**:
   - Android: Menu (3 pontos) → **Aparelhos conectados** → **Conectar um aparelho**
   - iPhone: **Configurações** → **Aparelhos conectados** → **Conectar um aparelho**

3. **Escaneie o QR Code** que aparece no WAHA Dashboard

4. **Aguarde a confirmação**:
   - Status deve mudar para: ✅ **"WORKING"** ou **"CONNECTED"**
   - Você verá informações do número conectado

### 3.3 Verificar Conexão

No WAHA Dashboard, você deve ver:
- ✅ Status: **WORKING** ou **CONNECTED**
- 📱 Número: **+55 81 8392-0320**
- 🟢 Indicador verde de conexão ativa

---

## 🔧 PASSO 4: Configurar Webhook para o n8n

### 4.1 Obter URL do Webhook

A URL do webhook do n8n é:
```
http://65.108.154.16:5678/webhook/b30ca6ce-471d-4a62-a3f5-50dd5ae1394b
```

**OU**, se estiverem no mesmo Docker network:
```
http://n8n:5678/webhook/b30ca6ce-471d-4a62-a3f5-50dd5ae1394b
```

### 4.2 Configurar no WAHA

1. **No WAHA Dashboard**, procure por:
   - **"Settings"** ou **"Configurações"**
   - **"Webhooks"**
   - **"Session Settings"** da sessão "default"

2. **Configure o webhook**:
   - **URL**: `http://n8n:5678/webhook/b30ca6ce-471d-4a62-a3f5-50dd5ae1394b`
   - **Events** (Eventos): Selecione:
     - ✅ `message`
     - ✅ `message.any`
     - ✅ `message.text` (se disponível)

3. **Salve a configuração**

### 4.3 Método Alternativo (Via API)

Se preferir configurar via API, execute no PowerShell:

```powershell
# Configurar webhook via API
$body = @{
    url = "http://n8n:5678/webhook/b30ca6ce-471d-4a62-a3f5-50dd5ae1394b"
    events = @("message", "message.any")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://65.108.154.16/api/sessions/default/webhook" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

---

## ✅ PASSO 5: Verificar se o n8n está Ativo

### 5.1 Acessar n8n

1. **Abra**: http://65.108.154.16:5678

2. **Faça login** (se necessário)
   - Se for a primeira vez, crie uma conta

### 5.2 Verificar Workflow

1. **Vá em "Workflows"** no menu lateral

2. **Procure pelo workflow**: "Agente Olinshop (Configurado)"

3. **Verifique se está ATIVO**:
   - Deve ter um botão **"Active"** em verde/azul
   - Se estiver inativo, clique para ativar

### 5.3 Verificar Credenciais

O workflow deve ter as seguintes credenciais configuradas:

#### Google Gemini
- API Key: `AIzaSyDxmoCXt87HDkmrjOJHm5wFqTK_9GOLMuU`

#### Vercel Postgres
- Host: `ep-steep-mountain-ahs14gfe-pooler.c-3.us-east-1.aws.neon.tech`
- Database: `neondb`
- User: `neondb_owner`
- Password: `npg_5AnqXwszBSt9`

**Se as credenciais não estiverem configuradas**, veja o arquivo `credenciais_n8n.txt` para instruções.

---

## 🧪 PASSO 6: Testar o Agente de IA

### 6.1 Teste Básico

1. **De outro celular ou WhatsApp Web**, envie uma mensagem para:
   ```
   +55 81 8392-0320
   ```

2. **Mensagem de teste**:
   ```
   Olá, preciso de ajuda
   ```

3. **Aguarde a resposta** (deve chegar em 2-5 segundos)

### 6.2 Teste de Consulta ao Banco

Envie:
```
Qual o status da minha assinatura? Meu email é teste@exemplo.com
```

O agente deve:
- Consultar o banco de dados
- Retornar informações da assinatura (se existir)

### 6.3 Verificar Execuções no n8n

1. **No n8n**, vá em **"Executions"** no menu lateral

2. **Você verá as execuções**:
   - ✅ Verde = Sucesso
   - ❌ Vermelho = Erro
   - 🔵 Azul = Em andamento

3. **Clique em uma execução** para ver detalhes:
   - Mensagem recebida
   - Resposta do Google Gemini
   - Consultas ao banco
   - Mensagem enviada

---

## 🐛 Troubleshooting (Resolução de Problemas)

### Problema 1: QR Code não aparece

**Soluções**:
1. Recarregue a página do WAHA Dashboard
2. Pare e inicie a sessão novamente
3. Verifique os logs: `docker logs waha`

### Problema 2: WhatsApp desconecta

**Soluções**:
1. Pare a sessão no WAHA
2. Inicie novamente
3. Escaneie o QR Code novamente
4. Certifique-se de que o celular está com internet estável

### Problema 3: Agente não responde

**Verificações**:
- [ ] Workflow está ativo no n8n?
- [ ] WhatsApp está conectado no WAHA (status WORKING)?
- [ ] Webhook está configurado corretamente?
- [ ] Verifique as execuções no n8n (menu "Executions")

**Solução**:
```bash
# Conecte via SSH e veja os logs
ssh -i "caminho/chave.pem" ubuntu@65.108.154.16

# Ver logs do n8n
docker logs -f n8n

# Ver logs do WAHA
docker logs -f waha
```

### Problema 4: Erro de credenciais no n8n

**Solução**:
1. Abra o workflow no n8n
2. Clique no nó "Google Gemini Chat"
3. Verifique/reconfigure a credencial
4. Faça o mesmo para "Consultar Banco" (Postgres)

### Problema 5: Webhook não recebe mensagens

**Teste manual do webhook**:
```powershell
# No PowerShell
$body = @{
    body = @{
        payload = @{
            from = "5581999999999@c.us"
            body = "teste"
        }
    }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "http://65.108.154.16:5678/webhook/b30ca6ce-471d-4a62-a3f5-50dd5ae1394b" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

Se o teste funcionar, o problema está na configuração do webhook no WAHA.

---

## 📊 Fluxo Completo do Sistema

```
Cliente envia mensagem WhatsApp
        ↓
WhatsApp Business (+55 81 8392-0320)
        ↓
WAHA (recebe e processa)
        ↓
Webhook → n8n (http://65.108.154.16:5678/webhook/...)
        ↓
Google Gemini AI (processa mensagem)
        ↓
Postgres (consulta dados se necessário)
        ↓
n8n (gera resposta)
        ↓
WAHA (envia resposta)
        ↓
Cliente recebe resposta no WhatsApp
```

---

## ✅ Checklist Final

Antes de considerar concluído, verifique:

- [ ] n8n está acessível em http://65.108.154.16:5678
- [ ] WAHA está acessível em http://65.108.154.16/dashboard
- [ ] WhatsApp Business está conectado (status WORKING)
- [ ] Webhook está configurado no WAHA
- [ ] Workflow está ATIVO no n8n
- [ ] Credenciais Google Gemini configuradas
- [ ] Credenciais Postgres configuradas
- [ ] Teste enviado e resposta recebida

---

## 📞 Suporte e Recursos

### Arquivos de Referência
- `N8N_AI_AGENT_SETUP.md` - Guia completo de setup
- `credenciais_n8n.txt` - Credenciais para copiar
- `n8n_agent_klingon.json` - Workflow para importar
- `SSH_COMMANDS.md` - Comandos SSH úteis

### Links Úteis
- **n8n**: http://65.108.154.16:5678
- **WAHA Dashboard**: http://65.108.154.16/dashboard
- **Documentação WAHA**: https://waha.devlike.pro
- **Documentação n8n**: https://docs.n8n.io

---

## 🎉 Próximos Passos

Após conectar com sucesso:

1. **Personalize o agente**:
   - Edite o System Prompt no n8n
   - Adicione mais ferramentas/consultas ao banco
   - Configure respostas automáticas

2. **Monitore o desempenho**:
   - Verifique execuções no n8n regularmente
   - Analise logs de erro
   - Ajuste respostas conforme necessário

3. **Expanda funcionalidades**:
   - Adicione consultas de pedidos
   - Integre com sistema de pagamentos
   - Configure notificações automáticas

---

**Boa sorte! 🚀**

Se precisar de ajuda, consulte os arquivos de documentação ou verifique os logs dos serviços.

**Última atualização**: 19/01/2026
