# N8N AI Agent - Guia Completo de Configuração

## 📋 Visão Geral

Este guia documenta a configuração completa do agente de IA n8n para suporte ao cliente via WhatsApp, integrando:
- **n8n**: Plataforma de automação de workflows
- **WAHA**: WhatsApp HTTP API para envio/recebimento de mensagens
- **Google Gemini**: Modelo de IA para processamento de linguagem natural
- **Vercel Postgres**: Banco de dados para consulta de assinaturas e pedidos

---

## 🖥️ Servidor Oracle Cloud

### Informações do Servidor
- **IP Público**: `65.108.154.16`
- **OS**: Ubuntu
- **Recursos**: 4 OCPUs, 24GB RAM (Ampere)
- **Acesso SSH**: Usar chave privada baixada durante criação da VM

### Serviços Rodando
- **n8n**: http://65.108.154.16:5678
- **WAHA Dashboard**: http://65.108.154.16/dashboard
- **WAHA API**: http://65.108.154.16/api

---

## 🔐 Credenciais

### 1. Google Gemini API
```
API Key: AIzaSyDxmoCXt87HDkmrjOJHm5wFqTK_9GOLMuU
Model: models/gemini-1.5-flash
```

### 2. Vercel Postgres
```
Host: ep-steep-mountain-ahs14gfe-pooler.c-3.us-east-1.aws.neon.tech
Database: neondb
User: neondb_owner
Password: npg_5AnqXwszBSt9
Port: 5432
SSL: Enabled (Allow Unauthorized)
```

### 3. WhatsApp (WAHA)
```
Número: +55 81 8392-0320
Session: default
Dashboard: http://65.108.154.16/dashboard
```

---

## 📱 Status Atual

### ✅ Concluído
- [x] VM Oracle Cloud criada e configurada
- [x] n8n instalado e rodando
- [x] WAHA instalado e rodando
- [x] Workflow JSON criado (`n8n_agent_klingon.json`)
- [x] Arquivo de credenciais documentado

### ⏳ Pendente
- [ ] Importar workflow no n8n
- [ ] Configurar credenciais do Google Gemini no n8n
- [ ] Configurar credenciais do Postgres no n8n
- [ ] Conectar WhatsApp no WAHA (escanear QR Code)
- [ ] Configurar webhook do WAHA para n8n
- [ ] Testar workflow completo

---

## 🚀 Próximos Passos

### Passo 1: Acessar n8n
1. Abra o navegador e acesse: http://65.108.154.16:5678
2. Faça login com suas credenciais do n8n
3. Se ainda não criou conta, crie uma nova

### Passo 2: Importar Workflow
1. No n8n, clique em **"Workflows"** no menu lateral
2. Clique em **"Import from File"** ou **"+"** → **"Import from File"**
3. Selecione o arquivo `n8n_agent_klingon.json`
4. O workflow será importado com os seguintes nós:
   - **Webhook WhatsApp**: Recebe mensagens do WAHA
   - **Google Gemini Chat**: Processa mensagens com IA
   - **Consultar Banco**: Busca dados no Postgres
   - **Definição da Ferramenta**: Define a tool para o agente
   - **Enviar WhatsApp (WAHA)**: Envia respostas via WAHA

### Passo 3: Configurar Credencial do Google Gemini
1. Abra o nó **"Google Gemini Chat"**
2. Clique em **"Credential to connect with"**
3. Selecione **"Create New Credential"**
4. No campo **"API Key"**, cole:
   ```
   AIzaSyDxmoCXt87HDkmrjOJHm5wFqTK_9GOLMuU
   ```
5. Clique em **"Save"**

### Passo 4: Configurar Credencial do Postgres
1. Abra o nó **"Consultar Banco"**
2. Clique em **"Credential to connect with"**
3. Selecione **"Create New Credential"** (tipo: Postgres)
4. Preencha os campos:
   - **Host**: `ep-steep-mountain-ahs14gfe-pooler.c-3.us-east-1.aws.neon.tech`
   - **Database**: `neondb`
   - **User**: `neondb_owner`
   - **Password**: `npg_5AnqXwszBSt9`
   - **Port**: `5432`
   - **SSL**: Ative a opção ou selecione "Allow Unauthorized"
5. Clique em **"Test Connection"** para verificar
6. Clique em **"Save"**

### Passo 5: Ativar Workflow
1. No canto superior direito, clique no botão **"Active"** para ativar o workflow
2. Copie a URL do webhook que aparecerá (algo como: `http://65.108.154.16:5678/webhook/whatsapp`)

### Passo 6: Conectar WhatsApp no WAHA
1. Acesse: http://65.108.154.16/dashboard
2. Faça login no WAHA (se necessário)
3. Procure pela sessão **"default"**
4. Se não estiver conectado, clique em **"Start Session"**
5. Escaneie o QR Code com o WhatsApp do número `+55 81 8392-0320`
6. Aguarde a confirmação de conexão

### Passo 7: Configurar Webhook no WAHA
1. No dashboard do WAHA, vá em **"Settings"** ou **"Webhooks"**
2. Configure o webhook para a sessão "default":
   - **URL**: `http://n8n:5678/webhook/whatsapp` (se estiverem no mesmo Docker network)
   - **OU**: `http://65.108.154.16:5678/webhook/whatsapp` (se não estiverem)
   - **Events**: Selecione `message` ou `message.any`
3. Salve a configuração

### Passo 8: Testar o Agente
1. Envie uma mensagem de teste para o número WhatsApp: `+55 81 8392-0320`
2. Exemplos de mensagens:
   - "Olá, preciso de ajuda"
   - "Qual o status da minha assinatura? Meu email é teste@exemplo.com"
   - "Meu último pagamento foi aprovado?"
3. Verifique no n8n se o workflow foi executado:
   - Vá em **"Executions"** no menu lateral
   - Veja os logs de execução
4. Verifique se recebeu resposta no WhatsApp

---

## 🔧 Troubleshooting

### Problema: n8n não está acessível
**Solução**:
```bash
# Conecte via SSH ao servidor
ssh -i /caminho/para/chave.pem ubuntu@65.108.154.16

# Verifique se n8n está rodando
docker ps | grep n8n

# Se não estiver, inicie:
docker start n8n
```

### Problema: WAHA não está acessível
**Solução**:
```bash
# Verifique se WAHA está rodando
docker ps | grep waha

# Se não estiver, inicie:
docker start waha
```

### Problema: WhatsApp desconecta
**Solução**:
1. Acesse o dashboard do WAHA
2. Pare a sessão "default"
3. Inicie novamente e escaneie o QR Code

### Problema: Workflow não recebe mensagens
**Verificações**:
1. Workflow está ativo no n8n?
2. Webhook do WAHA está configurado corretamente?
3. WhatsApp está conectado no WAHA?
4. Verifique os logs do n8n em "Executions"

### Problema: Erro ao consultar banco de dados
**Verificações**:
1. Credenciais do Postgres estão corretas?
2. Teste a conexão no nó "Consultar Banco"
3. Verifique se a tabela `subscriptions` existe:
   ```sql
   SELECT * FROM public.subscriptions LIMIT 1;
   ```

### Problema: Google Gemini não responde
**Verificações**:
1. API Key está correta?
2. Há quota disponível na API do Google?
3. Verifique os logs de erro no n8n

---

## 📊 Estrutura do Workflow

```
┌─────────────────────┐
│ Webhook WhatsApp    │ ← Recebe mensagem do WAHA
│ (Trigger)           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Google Gemini Chat  │ ← Processa com IA
│ (AI Agent)          │
└──────────┬──────────┘
           │
           ├─────────────────┐
           │                 │
           ▼                 ▼
┌──────────────────┐  ┌─────────────────┐
│ Definição Tool   │  │ Consultar Banco │
│ (consult_db)     │  │ (Postgres)      │
└──────────────────┘  └─────────────────┘
           │
           ▼
┌─────────────────────┐
│ Enviar WhatsApp     │ ← Envia resposta via WAHA
│ (WAHA)              │
└─────────────────────┘
```

---

## 🎯 Funcionalidades do Agente

O agente de IA está configurado para:

1. **Receber mensagens** via WhatsApp através do WAHA
2. **Processar** a mensagem usando Google Gemini
3. **Consultar banco de dados** quando necessário (assinaturas, pagamentos)
4. **Responder** de forma inteligente e contextual
5. **Encaminhar para humano** quando não souber responder

### Exemplos de Interações

**Cliente**: "Olá, preciso verificar minha assinatura"
**Agente**: "Olá! Claro, posso ajudar. Por favor, me informe seu email ou nome cadastrado."

**Cliente**: "Meu email é joao@exemplo.com"
**Agente**: *[Consulta banco de dados]* "Encontrei sua assinatura! Status: Ativa. Último pagamento: Aprovado em 10/01/2026."

**Cliente**: "Como faço para cancelar?"
**Agente**: "Para cancelamentos, vou encaminhar você para nossa equipe. Um momento, por favor."

---

## 📝 Notas Importantes

1. **Segurança**: As credenciais estão expostas neste documento. Em produção, use variáveis de ambiente.
2. **Backup**: Faça backup regular do workflow exportando o JSON.
3. **Monitoramento**: Verifique regularmente os logs de execução no n8n.
4. **Custos**: Monitore o uso da API do Google Gemini para evitar custos inesperados.
5. **WhatsApp**: O número pode ser banido se enviar spam. Use com moderação.

---

## 🔗 Links Úteis

- **n8n**: http://65.108.154.16:5678
- **WAHA Dashboard**: http://65.108.154.16/dashboard
- **Documentação n8n**: https://docs.n8n.io
- **Documentação WAHA**: https://waha.devlike.pro
- **Google Gemini API**: https://ai.google.dev

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção de Troubleshooting
2. Consulte os logs do n8n em "Executions"
3. Verifique o status dos containers Docker no servidor

---

**Última atualização**: 14/01/2026
**Status**: Configuração em andamento
