# 📱 WhatsApp Business - Quick Start

## 🚀 Início Rápido (5 Minutos)

### 1️⃣ Verificar Serviços
Abra no navegador:
- n8n: http://65.108.154.16:5678
- WAHA: http://65.108.154.16/dashboard

**Se não abrirem**, conecte via SSH e execute:
```bash
ssh -i "caminho/chave.pem" ubuntu@65.108.154.16
docker start n8n waha
exit
```

### 2️⃣ Conectar WhatsApp
1. Acesse: http://65.108.154.16/dashboard
2. Clique em **"Start Session"** na sessão "default"
3. Escaneie o QR Code com WhatsApp Business (+55 81 8392-0320)
4. Aguarde status: ✅ **WORKING**

### 3️⃣ Configurar Webhook
No WAHA, configure:
- **URL**: `http://n8n:5678/webhook/b30ca6ce-471d-4a62-a3f5-50dd5ae1394b`
- **Events**: `message`, `message.any`

### 4️⃣ Ativar Workflow
1. Acesse: http://65.108.154.16:5678
2. Vá em "Workflows"
3. Ative "Agente Olinshop (Configurado)"

### 5️⃣ Testar
Envie mensagem para **+55 81 8392-0320**:
```
Olá, preciso de ajuda
```

---

## 🔐 Credenciais Rápidas

### Google Gemini
```
AIzaSyDxmoCXt87HDkmrjOJHm5wFqTK_9GOLMuU
```

### Vercel Postgres
```
Host: ep-steep-mountain-ahs14gfe-pooler.c-3.us-east-1.aws.neon.tech
Database: neondb
User: neondb_owner
Password: npg_5AnqXwszBSt9
Port: 5432
```

### Webhook URL
```
http://n8n:5678/webhook/b30ca6ce-471d-4a62-a3f5-50dd5ae1394b
```

---

## 🆘 Problemas Comuns

**Serviços offline?**
```bash
ssh -i "chave.pem" ubuntu@65.108.154.16
docker start n8n waha
```

**WhatsApp desconecta?**
- Pare e inicie a sessão novamente no WAHA
- Escaneie o QR Code novamente

**Agente não responde?**
- Verifique se workflow está ATIVO no n8n
- Verifique "Executions" no n8n para ver erros
- Verifique webhook configurado no WAHA

---

## 📚 Guia Completo
Veja: `CONNECT_BUSINESS_WHATSAPP.md`

**Última atualização**: 19/01/2026
