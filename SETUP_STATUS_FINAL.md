# ✅ DOCKER + n8n + WAHA - SETUP COMPLETO

## 🎉 Status Atual: SERVIÇOS RODANDO!

**Data**: 20/01/2026 08:45  
**Status**: ✅ Docker containers ativos e prontos para configuração

---

## 📊 Serviços Ativos

| Serviço | Status | URL | Porta |
|---------|--------|-----|-------|
| **n8n** | ✅ Running | http://localhost:5678 | 5678 |
| **WAHA** | ✅ Running | http://localhost:3000 | 3000 |
| **PostgreSQL** | ✅ Running | localhost | 5432 |

---

## 🚀 O QUE FOI FEITO

### ✅ 1. Docker Setup
- Docker Compose configurado com 3 serviços
- Volumes persistentes criados:
  - `postgres_data/` - Banco de dados n8n
  - `n8n_data/` - Dados e workflows n8n
  - `waha_data/` - Sessões WhatsApp

### ✅ 2. Serviços Configurados
- **n8n**: Workflow automation rodando na porta 5678
- **WAHA**: WhatsApp API rodando na porta 3000
- **PostgreSQL**: Banco de dados para n8n

### ✅ 3. Credenciais Definidas
```
n8n:
  Username: admin
  Password: admin

WAHA:
  Username: admin
  Password: admin
```

### ✅ 4. Workflow Preparado
- Arquivo: `workflow_import.json`
- Contém: AI Agent com Google Gemini + PostgreSQL
- Pronto para importar no n8n

### ✅ 5. Documentação Criada
- ✅ `DOCKER_N8N_WAHA_SETUP.md` - Guia completo passo a passo
- ✅ `QUICK_REFERENCE.txt` - Referência rápida
- ✅ `check-docker-setup.ps1` - Script de verificação
- ✅ `open-services.ps1` - Script de acesso rápido
- ✅ Imagens visuais de guia criadas

---

## 📋 PRÓXIMOS PASSOS (O QUE VOCÊ PRECISA FAZER)

### **Passo 1: Conectar WhatsApp no WAHA** ⏳

1. **Acesse**: http://localhost:3000/dashboard
2. **Login**: admin / admin
3. **Criar Sessão**:
   - Clique em "+ Add Session"
   - Nome: `default`
   - Engine: `WEBJS`
   - Clique em "Create"
4. **Escanear QR Code**:
   - Abra WhatsApp Business no celular (+55 81 8392-0320)
   - Vá em Configurações → Aparelhos conectados
   - Escaneie o QR Code
5. **Aguarde**: Status mudar para "WORKING" (verde)

### **Passo 2: Configurar n8n** ⏳

1. **Acesse**: http://localhost:5678
2. **Login**: admin / admin
3. **Importar Workflow**:
   - Clique no menu "..." → "Import from File"
   - Selecione: `d:\Antigravity\olinshop\workflow_import.json`
   - Clique em "Save"
4. **Ativar Workflow**:
   - Toggle no canto superior direito (deve ficar verde)
5. **Copiar Webhook URL**:
   - Clique no nó "Webhook WhatsApp"
   - Copie a URL: `http://localhost:5678/webhook/whatsapp`

### **Passo 3: Conectar WAHA ao n8n** ⏳

1. **No WAHA Dashboard**: http://localhost:3000/dashboard
2. **Clique na sessão "default"**
3. **Vá em "Webhooks" ou "Settings"**
4. **Configure**:
   - URL: `http://n8n:5678/webhook/whatsapp`
   - Eventos: ✅ message, ✅ message.any
   - Salvar
5. **Testar**: Envie mensagem para +55 81 8392-0320

### **Passo 4: Testar o Sistema** ⏳

1. **Envie mensagem** para: +55 81 8392-0320
   ```
   Olá, preciso de ajuda
   ```

2. **Verifique no n8n**:
   - Acesse: http://localhost:5678
   - Clique em "Executions" no menu lateral
   - Deve aparecer uma execução com status "Success" (verde)

3. **Verifique WhatsApp**:
   - Deve receber resposta automática

---

## 🎯 ARQUITETURA DO SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                    WhatsApp Business                        │
│                  +55 81 8392-0320                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓ (mensagem recebida)
┌─────────────────────────────────────────────────────────────┐
│                   WAHA (WhatsApp API)                       │
│                  http://localhost:3000                      │
│  - Gerencia conexão WhatsApp                               │
│  - Envia/recebe mensagens                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓ (webhook POST)
┌─────────────────────────────────────────────────────────────┐
│                 n8n (Workflow Automation)                   │
│                  http://localhost:5678                      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  1. Webhook recebe mensagem                           │ │
│  │  2. Google Gemini AI processa                         │ │
│  │  3. PostgreSQL consulta dados (opcional)              │ │
│  │  4. Gera resposta inteligente                         │ │
│  │  5. Envia de volta para WAHA                          │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓ (resposta)
┌─────────────────────────────────────────────────────────────┐
│                   WAHA (WhatsApp API)                       │
│  - Envia resposta para WhatsApp                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    WhatsApp Business                        │
│              (Cliente recebe resposta)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ COMANDOS ÚTEIS

### Verificar Status
```powershell
# Ver containers rodando
docker-compose ps

# Verificar setup completo
.\check-docker-setup.ps1

# Ver logs em tempo real
docker-compose logs -f
```

### Gerenciar Serviços
```powershell
# Parar todos os serviços
docker-compose down

# Iniciar todos os serviços
docker-compose up -d

# Reiniciar todos os serviços
docker-compose restart

# Reiniciar apenas n8n
docker-compose restart n8n

# Reiniciar apenas WAHA
docker-compose restart waha
```

### Ver Logs
```powershell
# Logs de todos os serviços
docker-compose logs -f

# Logs apenas do n8n
docker-compose logs -f n8n

# Logs apenas do WAHA
docker-compose logs -f waha

# Últimas 50 linhas
docker-compose logs --tail=50
```

### Acesso Rápido
```powershell
# Abrir dashboards automaticamente
.\open-services.ps1

# Ou manualmente:
Start-Process "http://localhost:5678"      # n8n
Start-Process "http://localhost:3000/dashboard"  # WAHA
```

---

## 🔍 TROUBLESHOOTING

### ❌ Problema: WAHA não mostra QR Code

**Sintomas**: Dashboard carrega mas não aparece QR Code

**Solução**:
```powershell
# 1. Reiniciar WAHA
docker-compose restart waha

# 2. Ver logs para identificar erro
docker-compose logs -f waha

# 3. Se necessário, recriar container
docker-compose down
docker-compose up -d
```

### ❌ Problema: n8n não recebe mensagens

**Sintomas**: Mensagens enviadas mas n8n não mostra execuções

**Verificações**:
1. ✅ Workflow está ativo? (toggle verde no n8n)
2. ✅ Webhook URL está correta no WAHA?
3. ✅ WhatsApp está conectado no WAHA?

**Solução**:
```powershell
# Ver logs do n8n
docker-compose logs -f n8n

# Testar webhook manualmente
curl -X POST http://localhost:5678/webhook/whatsapp `
  -H "Content-Type: application/json" `
  -d '{\"body\":{\"payload\":{\"from\":\"5581999999999@c.us\",\"body\":\"teste\"}}}'
```

### ❌ Problema: Containers não iniciam

**Sintomas**: `docker-compose ps` mostra containers parados

**Solução**:
```powershell
# 1. Parar tudo
docker-compose down

# 2. Verificar se portas estão livres
netstat -ano | findstr :5678
netstat -ano | findstr :3000

# 3. Iniciar novamente
docker-compose up -d

# 4. Ver logs de inicialização
docker-compose logs
```

### ❌ Problema: WhatsApp desconecta

**Sintomas**: Status muda de "WORKING" para "FAILED"

**Solução**:
```powershell
# 1. Reiniciar sessão no WAHA Dashboard
# 2. Escanear QR Code novamente
# 3. Se persistir, deletar e recriar sessão
```

---

## 📊 CHECKLIST DE CONFIGURAÇÃO

### Infraestrutura
- [x] Docker instalado e rodando
- [x] Docker Compose configurado
- [x] Containers criados (n8n, WAHA, PostgreSQL)
- [x] Volumes persistentes criados
- [x] Portas 5678 e 3000 disponíveis

### WAHA
- [ ] Dashboard acessível (http://localhost:3000)
- [ ] Login realizado (admin/admin)
- [ ] Sessão "default" criada
- [ ] QR Code escaneado
- [ ] WhatsApp conectado (status WORKING)
- [ ] Webhook configurado para n8n

### n8n
- [ ] Dashboard acessível (http://localhost:5678)
- [ ] Login realizado (admin/admin)
- [ ] Workflow importado
- [ ] Workflow ativado (toggle verde)
- [ ] Webhook URL copiada
- [ ] Google Gemini configurado (opcional)
- [ ] PostgreSQL configurado (opcional)

### Testes
- [ ] Mensagem enviada para WhatsApp
- [ ] n8n recebeu webhook
- [ ] Execução aparece em "Executions"
- [ ] Status da execução é "Success"
- [ ] WhatsApp respondeu automaticamente

---

## 🎯 RESULTADO ESPERADO

Quando tudo estiver configurado:

1. ✅ Você envia: `"Olá"` para **+55 81 8392-0320**
2. ✅ WAHA recebe a mensagem
3. ✅ WAHA envia para n8n via webhook
4. ✅ n8n processa com Google Gemini AI
5. ✅ n8n envia resposta de volta para WAHA
6. ✅ WAHA envia para WhatsApp
7. ✅ Você recebe resposta automática em **2-5 segundos**

---

## 📞 RECURSOS E LINKS

### Dashboards
- **n8n**: http://localhost:5678
- **WAHA**: http://localhost:3000/dashboard
- **WAHA API**: http://localhost:3000/api

### Documentação
- **n8n Docs**: https://docs.n8n.io
- **WAHA Docs**: https://waha.devlike.pro
- **Google Gemini**: https://ai.google.dev

### Arquivos Locais
- `docker-compose.yml` - Configuração Docker
- `.env.local_docker` - Variáveis de ambiente
- `workflow_import.json` - Workflow n8n
- `DOCKER_N8N_WAHA_SETUP.md` - Guia detalhado
- `QUICK_REFERENCE.txt` - Referência rápida
- `check-docker-setup.ps1` - Verificação de status
- `open-services.ps1` - Acesso rápido

---

## 🎉 CONCLUSÃO

### ✅ O que está pronto:
- Docker Compose configurado e rodando
- n8n acessível e pronto para uso
- WAHA acessível e pronto para conectar WhatsApp
- Workflow preparado para importação
- Documentação completa criada
- Scripts de automação prontos

### ⏳ O que falta fazer (VOCÊ):
1. **Conectar WhatsApp no WAHA** (5 minutos)
2. **Importar workflow no n8n** (2 minutos)
3. **Configurar webhook no WAHA** (1 minuto)
4. **Testar enviando mensagem** (1 minuto)

**Tempo total estimado**: ~10 minutos

---

## 🚀 COMECE AGORA!

1. Abra seu navegador
2. Acesse: http://localhost:3000/dashboard
3. Siga o guia em `DOCKER_N8N_WAHA_SETUP.md`
4. Em 10 minutos você terá um AI Agent respondendo no WhatsApp!

---

**Última atualização**: 20/01/2026 08:50  
**Status**: ✅ Infraestrutura pronta, aguardando configuração final  
**Próximo passo**: Conectar WhatsApp no WAHA
