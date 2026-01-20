# 🚀 Docker + n8n + WAHA Setup - Continuação

## ✅ Status Atual

Seus serviços Docker estão **RODANDO**:
- ✅ **n8n**: http://localhost:5678
- ✅ **WAHA**: http://localhost:3000
- ✅ **PostgreSQL**: Container ativo

---

## 📋 Próximos Passos

### **Passo 1: Acessar WAHA Dashboard**

1. Abra seu navegador e acesse:
   ```
   http://localhost:3000/dashboard
   ```

2. **Credenciais de Login** (se solicitado):
   - **Username**: `admin`
   - **Password**: `admin`

3. Se aparecer uma tela de API Swagger, clique no botão **"Dashboard"** no canto superior direito

---

### **Passo 2: Conectar WhatsApp no WAHA**

#### 2.1. Criar/Iniciar Sessão

1. No dashboard do WAHA, procure por:
   - Botão **"+ Add Session"** ou **"Create Session"**
   - Ou uma sessão existente chamada **"default"**

2. Se não houver sessão, crie uma nova:
   - **Session Name**: `default`
   - **Engine**: Selecione `WEBJS` ou `NOWEB` (recomendado: WEBJS)
   - Clique em **"Create"** ou **"Start"**

#### 2.2. Escanear QR Code

1. Após criar/iniciar a sessão, você verá um **QR Code**

2. **No seu celular**:
   - Abra o WhatsApp Business (número: **+55 81 8392-0320**)
   - Vá em **Configurações** → **Aparelhos conectados**
   - Toque em **"Conectar um aparelho"**
   - Escaneie o QR Code mostrado no WAHA

3. Aguarde a mensagem de **"Connected"** ou **"Authenticated"**

#### 2.3. Verificar Conexão

- O status da sessão deve mudar para:
  - ✅ **"WORKING"** ou **"CONNECTED"** (verde)
  
- Se aparecer **"FAILED"** ou **"STOPPED"**:
  - Clique em **"Restart Session"**
  - Escaneie o QR Code novamente

---

### **Passo 3: Configurar Webhook no WAHA**

#### 3.1. Acessar Configurações de Webhook

1. No dashboard do WAHA, clique na sessão **"default"**

2. Procure por:
   - Aba **"Webhooks"** ou **"Settings"**
   - Ou botão de **configurações** (ícone de engrenagem)

#### 3.2. Configurar URL do Webhook

1. **URL do Webhook**:
   ```
   http://n8n:5678/webhook/whatsapp
   ```
   
   **OU** (se não funcionar):
   ```
   http://localhost:5678/webhook/whatsapp
   ```

2. **Eventos para Ativar**:
   - ✅ `message`
   - ✅ `message.any`
   - ✅ `session.status`

3. Clique em **"Save"** ou **"Update"**

#### 3.3. Testar Webhook

1. No WAHA, procure por botão **"Test Webhook"** ou **"Send Test"**

2. Ou envie uma mensagem de teste para o WhatsApp:
   - Envie: `Olá, teste`
   - Verifique se o n8n recebeu a mensagem (veja Passo 4)

---

### **Passo 4: Verificar n8n**

#### 4.1. Acessar n8n

1. Abra: http://localhost:5678

2. **Credenciais de Login**:
   - **Username**: `admin`
   - **Password**: `admin`

#### 4.2. Importar Workflow (se necessário)

Se o workflow ainda não estiver importado:

1. No n8n, clique em **"+ Add workflow"**

2. Clique no menu **"..."** → **"Import from File"**

3. Selecione o arquivo:
   ```
   d:\Antigravity\olinshop\workflow_import.json
   ```

4. Clique em **"Save"** e depois em **"Activate"** (toggle no canto superior direito)

#### 4.3. Verificar Webhook URL

1. Abra o workflow importado

2. Clique no nó **"Webhook"** (primeiro nó)

3. Verifique a **Production URL**:
   ```
   http://localhost:5678/webhook/whatsapp
   ```

4. **Copie essa URL** - você vai precisar dela no WAHA

#### 4.4. Monitorar Execuções

1. No menu lateral do n8n, clique em **"Executions"**

2. Aqui você verá todas as mensagens recebidas do WhatsApp

3. Clique em uma execução para ver detalhes:
   - Dados recebidos
   - Resposta do AI
   - Mensagem enviada

---

### **Passo 5: Configurar AI Agent (Opcional)**

Se você quiser que o agente responda automaticamente:

#### 5.1. Configurar Google Gemini

1. No workflow do n8n, clique no nó **"AI Agent"**

2. Em **"Credentials"**, adicione:
   - **API Key**: `AIzaSyDxmoCXt87HDkmrjOJHm5wFqTK_9GOLMuU`
   - **Model**: `gemini-2.0-flash-001`

#### 5.2. Configurar Banco de Dados (Opcional)

Se quiser que o agente consulte o banco de dados:

1. Clique no nó **"Postgres"** ou **"Database Tool"**

2. Configure as credenciais do Vercel Postgres:
   ```
   Host: ep-steep-mountain-ahs14gfe-pooler.c-3.us-east-1.aws.neon.tech
   Database: neondb
   User: neondb_owner
   Password: npg_5AnqXwszBSt9
   Port: 5432
   SSL: Enabled
   ```

---

### **Passo 6: Testar o Sistema Completo**

#### 6.1. Teste Simples

1. Envie uma mensagem para o WhatsApp **+55 81 8392-0320**:
   ```
   Olá, preciso de ajuda
   ```

2. **Verificar no n8n**:
   - Vá em **Executions**
   - Você deve ver uma nova execução
   - Status deve ser **"Success"** (verde)

3. **Verificar resposta**:
   - O WhatsApp deve responder automaticamente
   - Se não responder, verifique os logs da execução no n8n

#### 6.2. Teste com AI (se configurado)

1. Envie:
   ```
   Qual o status da minha assinatura? Meu email é teste@exemplo.com
   ```

2. O agente deve:
   - Consultar o banco de dados
   - Retornar informações da assinatura
   - Ou informar que não encontrou dados

---

## 🔧 Troubleshooting

### Problema: WAHA não mostra QR Code

**Solução**:
```powershell
# Reiniciar WAHA
docker-compose restart waha

# Ver logs
docker-compose logs -f waha
```

### Problema: n8n não recebe mensagens

**Verificações**:
1. ✅ Workflow está ativo? (toggle verde)
2. ✅ Webhook URL está correta no WAHA?
3. ✅ WhatsApp está conectado no WAHA?

**Solução**:
```powershell
# Ver logs do n8n
docker-compose logs -f n8n

# Reiniciar n8n
docker-compose restart n8n
```

### Problema: Webhook não funciona

**Teste manual**:
```powershell
# Testar webhook diretamente
curl -X POST http://localhost:5678/webhook/whatsapp `
  -H "Content-Type: application/json" `
  -d '{\"body\":{\"payload\":{\"from\":\"5581999999999@c.us\",\"body\":\"teste\"}}}'
```

### Problema: Containers não estão rodando

**Solução**:
```powershell
# Parar tudo
docker-compose down

# Iniciar novamente
docker-compose up -d

# Ver status
docker-compose ps
```

---

## 📊 Comandos Úteis

### Ver logs em tempo real
```powershell
# Todos os serviços
docker-compose logs -f

# Apenas n8n
docker-compose logs -f n8n

# Apenas WAHA
docker-compose logs -f waha
```

### Reiniciar serviços
```powershell
# Reiniciar tudo
docker-compose restart

# Reiniciar apenas n8n
docker-compose restart n8n

# Reiniciar apenas WAHA
docker-compose restart waha
```

### Parar e iniciar
```powershell
# Parar tudo
docker-compose down

# Iniciar tudo
docker-compose up -d

# Iniciar com logs visíveis
docker-compose up
```

---

## ✅ Checklist de Configuração

- [ ] WAHA acessível em http://localhost:3000
- [ ] WhatsApp conectado no WAHA (QR Code escaneado)
- [ ] Sessão "default" com status "WORKING"
- [ ] Webhook configurado no WAHA
- [ ] n8n acessível em http://localhost:5678
- [ ] Workflow importado e ativado no n8n
- [ ] Teste de mensagem enviado e recebido
- [ ] n8n mostra execução bem-sucedida
- [ ] WhatsApp responde automaticamente

---

## 🎯 Resultado Esperado

Após completar todos os passos:

1. ✅ Você envia mensagem para **+55 81 8392-0320**
2. ✅ WAHA recebe a mensagem
3. ✅ WAHA envia para n8n via webhook
4. ✅ n8n processa com AI Agent (se configurado)
5. ✅ n8n envia resposta de volta para WAHA
6. ✅ WAHA envia resposta para o WhatsApp
7. ✅ Você recebe a resposta no WhatsApp

---

## 📞 Links Rápidos

- **n8n Dashboard**: http://localhost:5678
- **WAHA Dashboard**: http://localhost:3000/dashboard
- **WAHA API Docs**: http://localhost:3000/api
- **Documentação n8n**: https://docs.n8n.io
- **Documentação WAHA**: https://waha.devlike.pro

---

**Última atualização**: 20/01/2026 08:35
**Status**: Serviços rodando, aguardando configuração do WhatsApp
