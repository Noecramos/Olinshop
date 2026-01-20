# 🔑 Como Encontrar e Usar sua Chave SSH

## 📍 Localizando sua Chave SSH

A chave SSH foi baixada quando você criou a VM no Oracle Cloud. Vamos encontrá-la!

### Passo 1: Verificar Locais Comuns

A chave geralmente está em um destes locais:

**Windows:**
```
C:\Users\SeuNome\Downloads\
C:\Users\SeuNome\Documents\
C:\Users\SeuNome\.ssh\
D:\Downloads\
```

**Nomes comuns do arquivo:**
- `oracle-cloud-key.pem`
- `ssh-key-*.key`
- `ssh-key-*.pem`
- `id_rsa`
- Qualquer arquivo com extensão `.pem` ou `.key`

### Passo 2: Procurar no Windows Explorer

1. Abra o **Windows Explorer** (Win + E)
2. Vá para a pasta **Downloads**
3. Procure por arquivos com extensão `.pem` ou `.key`
4. Se não encontrar, use a busca do Windows:
   - Pressione **Win + S**
   - Digite: `*.pem` ou `*.key`
   - Procure por arquivos relacionados a "oracle" ou "ssh"

### Passo 3: Verificar no Oracle Cloud Console

Se não encontrar a chave:

1. Acesse: https://cloud.oracle.com
2. Faça login
3. Vá em **Compute** → **Instances**
4. Clique na sua VM
5. Vá em **Resources** → **Console Connection**
6. Você pode precisar criar uma nova chave SSH

---

## 🚀 Opções para Iniciar WAHA

### Opção 1: Script Interativo (Recomendado)

Execute o script e informe o caminho da chave quando solicitado:

```powershell
powershell -ExecutionPolicy Bypass -File start-waha.ps1
```

Quando pedir o caminho, cole algo como:
```
C:\Users\SeuNome\Downloads\oracle-cloud-key.pem
```

### Opção 2: Comando Direto (Se você já sabe onde está a chave)

Substitua `CAMINHO_DA_CHAVE` pelo caminho real:

```powershell
ssh -i "CAMINHO_DA_CHAVE" ubuntu@65.108.154.16 "docker start waha && docker ps | grep waha"
```

**Exemplo:**
```powershell
ssh -i "C:\Users\noecr\Downloads\oracle-key.pem" ubuntu@65.108.154.16 "docker start waha && docker ps | grep waha"
```

### Opção 3: Usar PuTTY (Windows)

Se preferir usar PuTTY:

1. **Baixe PuTTY**: https://www.putty.org/
2. **Converta a chave** (se for .pem):
   - Abra **PuTTYgen**
   - Load → Selecione sua chave .pem
   - Save private key → Salve como .ppk
3. **Conecte**:
   - Abra **PuTTY**
   - Host: `65.108.154.16`
   - Port: `22`
   - Connection → SSH → Auth → Browse → Selecione o .ppk
   - Clique em **Open**
4. **Execute no terminal**:
   ```bash
   docker start waha
   docker ps | grep waha
   ```

### Opção 4: Pedir ao Administrador

Se você não tem acesso SSH, peça ao administrador do servidor para executar:

```bash
docker start waha
```

---

## ✅ Após Iniciar WAHA

### 1. Verificar se está Online

Abra no navegador:
```
http://65.108.154.16/dashboard
```

Se abrir, WAHA está online! ✅

### 2. Conectar WhatsApp

1. Clique em **"Start Session"** na sessão "default"
2. Aguarde o QR Code aparecer
3. Abra WhatsApp Business no celular (+55 81 8392-0320)
4. Vá em **Aparelhos Conectados** → **Conectar um aparelho**
5. Escaneie o QR Code
6. Aguarde status: ✅ **WORKING**

### 3. Configurar Webhook

No WAHA Dashboard:
1. Vá em **Settings** ou **Webhooks**
2. Configure:
   - **URL**: `http://n8n:5678/webhook/b30ca6ce-471d-4a62-a3f5-50dd5ae1394b`
   - **Events**: `message`, `message.any`
3. Salve

### 4. Testar

Envie uma mensagem para **+55 81 8392-0320**:
```
Olá, preciso de ajuda
```

Você deve receber uma resposta automática do agente de IA!

---

## 🐛 Problemas Comuns

### "Permission denied (publickey)"

**Causa**: Chave SSH incorreta ou sem permissões

**Solução**:
```powershell
# Dar permissões corretas (Windows)
icacls "C:\caminho\chave.pem" /inheritance:r /grant:r "%username%:R"
```

### "Connection refused"

**Causa**: Servidor offline ou porta bloqueada

**Solução**:
1. Verifique se o servidor está online no Oracle Cloud Console
2. Verifique Security Lists (porta 22 deve estar aberta)

### "Host key verification failed"

**Solução**:
```powershell
ssh -o StrictHostKeyChecking=no -i "caminho/chave.pem" ubuntu@65.108.154.16
```

### Não consigo encontrar a chave SSH

**Solução**:
1. Verifique no Oracle Cloud Console se você pode baixar novamente
2. Ou crie uma nova chave SSH:
   - Oracle Cloud Console → Compute → Instances
   - Clique na VM → Console Connection
   - Create Console Connection → Baixe nova chave

---

## 📞 Precisa de Ajuda?

Se ainda tiver dificuldades:

1. **Verifique os guias**:
   - `CONNECT_BUSINESS_WHATSAPP.md` - Guia completo
   - `WHATSAPP_QUICK_START.md` - Guia rápido
   - `SSH_COMMANDS.md` - Comandos SSH

2. **Informações do servidor**:
   - IP: `65.108.154.16`
   - Usuário: `ubuntu`
   - Porta SSH: `22`

3. **Teste se o servidor está acessível**:
   ```powershell
   Test-NetConnection -ComputerName 65.108.154.16 -Port 22
   ```

---

**Última atualização**: 19/01/2026 18:10
