# Verificar Docker no VPS

## Informações do Servidor
- **IP**: 65.108.154.16
- **OS**: Ubuntu
- **Usuário**: ubuntu

## Comandos para Verificar Docker

### 1. Conectar ao Servidor via SSH

```bash
# Windows (PowerShell)
ssh -i "caminho\para\sua\chave.pem" ubuntu@65.108.154.16

# Exemplo:
ssh -i "C:\Users\SeuUsuario\Downloads\oracle-cloud-key.pem" ubuntu@65.108.154.16
```

### 2. Verificar se Docker está Instalado

```bash
# Verificar versão do Docker
docker --version

# Verificar status do serviço Docker
sudo systemctl status docker

# Verificar se Docker está rodando
docker ps
```

### 3. Verificar Containers n8n e WAHA

```bash
# Listar todos os containers (rodando e parados)
docker ps -a

# Verificar apenas containers rodando
docker ps

# Verificar logs do n8n
docker logs n8n

# Verificar logs do WAHA
docker logs waha
```

### 4. Iniciar Containers (se necessário)

```bash
# Iniciar n8n
docker start n8n

# Iniciar WAHA
docker start waha

# Verificar se iniciaram
docker ps
```

## Resultados Esperados

### Se Docker está instalado:
```
Docker version 24.0.x, build xxxxx
```

### Se containers existem:
```
CONTAINER ID   IMAGE              STATUS
abc123...      n8nio/n8n         Up/Exited
def456...      devlikeapro/waha  Up/Exited
```

## Próximos Passos

Dependendo do resultado:

### ✅ Docker instalado e containers rodando
- Prosseguir com configuração do WhatsApp no WAHA

### ⚠️ Docker instalado mas containers parados
- Iniciar containers com `docker start n8n waha`

### ❌ Docker não instalado
- Instalar Docker no servidor
- Instalar n8n e WAHA

---

**Você tem a chave SSH para acessar o servidor?**
- Se sim, execute os comandos acima
- Se não, precisamos localizar a chave ou criar uma nova
