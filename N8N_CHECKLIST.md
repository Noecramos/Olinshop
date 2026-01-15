# ✅ N8N AI AGENT - CHECKLIST DE CONFIGURAÇÃO

## 📊 Status Atual (14/01/2026 12:34)

### Infraestrutura
- [x] VM Oracle Cloud criada (65.108.154.16)
- [x] n8n instalado
- [x] WAHA instalado
- [ ] **n8n rodando** ⚠️ OFFLINE
- [ ] **WAHA rodando** ⚠️ OFFLINE

### Arquivos Preparados
- [x] `n8n_agent_klingon.json` - Workflow do agente
- [x] `credenciais_n8n.txt` - Credenciais documentadas
- [x] `N8N_AI_AGENT_SETUP.md` - Guia completo
- [x] `SSH_COMMANDS.md` - Comandos SSH
- [x] `check-status.ps1` - Script de verificação

### Configuração n8n
- [ ] Acessar n8n (http://65.108.154.16:5678)
- [ ] Fazer login/criar conta
- [ ] Importar workflow `n8n_agent_klingon.json`
- [ ] Configurar credencial Google Gemini
- [ ] Configurar credencial Vercel Postgres
- [ ] Ativar workflow
- [ ] Copiar URL do webhook

### Configuração WAHA
- [ ] Acessar WAHA Dashboard (http://65.108.154.16/dashboard)
- [ ] Iniciar sessão "default"
- [ ] Escanear QR Code com WhatsApp (+55 81 8392-0320)
- [ ] Verificar conexão estabelecida
- [ ] Configurar webhook para n8n

### Testes
- [ ] Enviar mensagem de teste para WhatsApp
- [ ] Verificar execução no n8n
- [ ] Verificar resposta recebida
- [ ] Testar consulta ao banco de dados
- [ ] Validar fluxo completo

---

## 🎯 AÇÃO IMEDIATA NECESSÁRIA

### ⚠️ Serviços Offline

Os serviços n8n e WAHA estão **OFFLINE** no servidor. Você precisa:

1. **Conectar ao servidor via SSH**
   ```bash
   ssh -i "caminho/para/chave.pem" ubuntu@65.108.154.16
   ```

2. **Iniciar os containers**
   ```bash
   docker start n8n waha
   ```

3. **Verificar se subiram**
   ```bash
   docker ps
   ```

4. **Testar acesso**
   - n8n: http://65.108.154.16:5678
   - WAHA: http://65.108.154.16/dashboard

**Consulte**: `SSH_COMMANDS.md` para comandos detalhados

---

## 📝 Credenciais Rápidas

### Google Gemini
```
API Key: AIzaSyDxmoCXt87HDkmrjOJHm5wFqTK_9GOLMuU
```

### Vercel Postgres
```
Host: ep-steep-mountain-ahs14gfe-pooler.c-3.us-east-1.aws.neon.tech
Database: neondb
User: neondb_owner
Password: npg_5AnqXwszBSt9
Port: 5432
SSL: Enabled
```

### WhatsApp
```
Número: +55 81 8392-0320
Session: default
```

---

## 🔗 Links Rápidos

- **n8n**: http://65.108.154.16:5678
- **WAHA Dashboard**: http://65.108.154.16/dashboard
- **WAHA API**: http://65.108.154.16/api

---

## 📚 Documentação

1. **N8N_AI_AGENT_SETUP.md** - Guia completo passo a passo
2. **SSH_COMMANDS.md** - Comandos para gerenciar servidor
3. **credenciais_n8n.txt** - Credenciais formatadas para copiar
4. **n8n_agent_klingon.json** - Workflow para importar

---

## 🚀 Fluxo de Trabalho Esperado

```
WhatsApp (+55 81 8392-0320)
    ↓
WAHA (recebe mensagem)
    ↓
Webhook → n8n
    ↓
Google Gemini (processa com IA)
    ↓
Postgres (consulta dados se necessário)
    ↓
n8n (gera resposta)
    ↓
WAHA (envia resposta)
    ↓
WhatsApp (cliente recebe)
```

---

## 💡 Próximo Passo

**Execute agora**:
```powershell
powershell -ExecutionPolicy Bypass -File check-status.ps1
```

Se ainda estiver offline, siga as instruções em `SSH_COMMANDS.md` para iniciar os serviços.

---

**Última atualização**: 14/01/2026 12:34
