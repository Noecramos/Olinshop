# N8N AI Agent - Comandos SSH para Gerenciar Serviços

## 🔌 Status Atual
- **n8n**: OFFLINE ❌
- **WAHA**: OFFLINE ❌
- **Servidor**: 65.108.154.16

## 🚀 Como Iniciar os Serviços

### Passo 1: Conectar ao Servidor via SSH

Você precisa da chave privada SSH que foi baixada quando criou a VM no Oracle Cloud.

```bash
# Windows (PowerShell ou CMD)
ssh -i "caminho\para\sua\chave.pem" ubuntu@65.108.154.16

# Exemplo:
ssh -i "C:\Users\SeuUsuario\Downloads\oracle-cloud-key.pem" ubuntu@65.108.154.16
```

**Nota**: Se estiver usando Windows e a chave estiver em formato `.key`, você pode precisar converter para `.pem` ou usar PuTTY.

### Passo 2: Verificar Containers Docker

Depois de conectado via SSH, execute:

```bash
# Listar todos os containers (rodando e parados)
docker ps -a

# Você deve ver algo como:
# CONTAINER ID   IMAGE       STATUS
# abc123...      n8n         Exited
# def456...      waha        Exited
```

### Passo 3: Iniciar os Containers

```bash
# Iniciar n8n
docker start n8n

# Iniciar WAHA
docker start waha

# Ou iniciar ambos de uma vez
docker start n8n waha
```

### Passo 4: Verificar se Estão Rodando

```bash
# Ver containers rodando
docker ps

# Ver logs do n8n
docker logs n8n

# Ver logs do WAHA
docker logs waha
```

### Passo 5: Verificar Portas

```bash
# Verificar se as portas estão abertas
sudo netstat -tulpn | grep -E '5678|3000|80'

# Ou usar:
sudo ss -tulpn | grep -E '5678|3000|80'
```

## 🔄 Comandos Úteis

### Reiniciar Containers
```bash
docker restart n8n
docker restart waha
```

### Parar Containers
```bash
docker stop n8n
docker stop waha
```

### Ver Logs em Tempo Real
```bash
# n8n
docker logs -f n8n

# WAHA
docker logs -f waha

# Pressione Ctrl+C para sair
```

### Verificar Status dos Containers
```bash
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## 🐛 Troubleshooting

### Problema: Containers não iniciam

```bash
# Ver erro detalhado
docker logs n8n
docker logs waha

# Recriar container (se necessário)
docker rm n8n
docker run -d --name n8n -p 5678:5678 n8nio/n8n
```

### Problema: Porta já está em uso

```bash
# Ver o que está usando a porta 5678
sudo lsof -i :5678

# Ou
sudo netstat -tulpn | grep 5678
```

### Problema: Firewall bloqueando

```bash
# Verificar regras do firewall
sudo iptables -L -n

# Abrir porta 5678 (n8n)
sudo iptables -A INPUT -p tcp --dport 5678 -j ACCEPT

# Abrir porta 80 (WAHA)
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Salvar regras
sudo netstat-persistent save
```

### Problema: Não consigo conectar via SSH

1. **Verifique se a chave SSH está correta**
2. **Verifique as Security Lists no Oracle Cloud**:
   - Acesse Oracle Cloud Console
   - Vá em Networking → Virtual Cloud Networks
   - Selecione sua VCN
   - Vá em Security Lists
   - Certifique-se que a porta 22 (SSH) está aberta

## 📦 Instalação Completa (Se Necessário)

Se os containers não existirem, você pode instalá-los:

### Instalar n8n

```bash
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Instalar WAHA

```bash
docker run -d \
  --name waha \
  --restart unless-stopped \
  -p 80:3000 \
  -v ~/.waha:/app/.sessions \
  devlikeapro/waha
```

## ✅ Verificação Final

Depois de iniciar os serviços, execute o script de verificação novamente:

```powershell
# No seu computador Windows
powershell -ExecutionPolicy Bypass -File check-status.ps1
```

Ou teste manualmente:
- **n8n**: http://65.108.154.16:5678
- **WAHA**: http://65.108.154.16/dashboard

## 📞 Próximos Passos Após Serviços Online

1. ✅ Acessar n8n e fazer login
2. ✅ Importar workflow `n8n_agent_klingon.json`
3. ✅ Configurar credenciais (Google Gemini + Postgres)
4. ✅ Acessar WAHA e conectar WhatsApp
5. ✅ Configurar webhook do WAHA
6. ✅ Testar o agente

Consulte **N8N_AI_AGENT_SETUP.md** para instruções detalhadas de cada passo.

---

**Última verificação**: 14/01/2026 12:34
**Status**: Serviços offline - necessário iniciar via SSH
