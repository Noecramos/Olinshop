# 🚀 N8N WORKFLOW SETUP - STEP BY STEP GUIDE

## ✅ Prerequisites (Already Done!)
- ✅ Docker installed and running
- ✅ n8n running on http://localhost:5678
- ✅ WAHA running on http://localhost:3000
- ✅ WhatsApp connected to WAHA

---

## 📋 STEP 1: Access n8n Dashboard

1. **Open n8n**: http://localhost:5678
2. **Login credentials**:
   - Username: `admin`
   - Password: `admin`

---

## 📥 STEP 2: Import the Workflow

### Option A: Import via UI (Recommended)

1. In n8n dashboard, click the **"+"** button (top right) or **"Add workflow"**
2. Click the **"⋮"** (three dots menu) in the top right
3. Select **"Import from File"**
4. Browse to: `d:\Antigravity\olinshop\workflow_import.json`
5. Click **"Open"**
6. The workflow will load with all nodes

### Option B: Import via URL

1. Click **"Add workflow"**
2. Click **"⋮"** → **"Import from URL"**
3. If you have the workflow hosted somewhere, paste the URL
4. Click **"Import"**

---

## ⚙️ STEP 3: Configure the Workflow

The workflow has 5 main nodes that need configuration:

### **Node 1: Webhook WhatsApp** ✅ (Already configured)
- **Path**: `whatsapp`
- **Method**: POST
- **Production URL**: `http://localhost:5678/webhook/whatsapp`
- ✅ No changes needed!

### **Node 2: Google Gemini Chat** ⚠️ (Needs API Key)

**You need to configure Google Gemini API:**

1. Click on the **"Google Gemini Chat"** node
2. Click **"Create New Credential"**
3. Enter your **Google Gemini API Key**:
   ```
   AIzaSyDxmoCXt87HDkmrjOJHm5wFqTK_9GOLMuU
   ```
4. Click **"Save"**

**System Prompt** (already configured):
```
Você é um assistente de suporte inteligente para o Olinshop e Olindelivery.

Seu objetivo é ajudar clientes com dúvidas sobre pedidos e assinaturas.

FERRAMENTAS DISPONÍVEIS:
- consult_database: Use isso para verificar pagamentos e status de assinatura.

Se não souber a resposta, diga que vai encaminhar para um humano.
```

### **Node 3: Consultar Banco (PostgreSQL)** ⚠️ (Optional - Needs DB Config)

**If you want the AI to query your database:**

1. Click on **"Consultar Banco"** node
2. Click **"Create New Credential"**
3. Enter your Vercel Postgres credentials:
   ```
   Host: ep-steep-mountain-ahs14gfe-pooler.c-3.us-east-1.aws.neon.tech
   Database: neondb
   User: neondb_owner
   Password: npg_5AnqXwszBSt9
   Port: 5432
   SSL: Enabled
   ```
4. Click **"Save"**

**Skip this if you don't need database queries**

### **Node 4: Enviar WhatsApp (WAHA)** ✅ (Already configured)
- **URL**: `http://waha:3000/api/sendText`
- **Method**: POST
- **Session**: `default`
- ✅ No changes needed!

---

## 🔄 STEP 4: Activate the Workflow

1. Click the **"Save"** button (top right)
2. **Toggle the workflow to ACTIVE**:
   - Look for the toggle switch in the top right
   - It should turn **GREEN** when active
3. The workflow is now listening for WhatsApp messages!

---

## 🧪 STEP 5: Test the Workflow

### **Test 1: Send a Simple Message**

1. Send a message to your WhatsApp Business number: **+55 81 8392-0320**
   ```
   Olá, preciso de ajuda
   ```

2. **Check n8n Executions**:
   - In n8n, click **"Executions"** in the left sidebar
   - You should see a new execution
   - Status should be **"Success"** (green)

3. **Check WhatsApp**:
   - You should receive an automatic response
   - The AI should introduce itself

### **Test 2: Test with AI Response**

Send:
```
Qual o horário de funcionamento?
```

Expected: AI should respond or say it will forward to a human

### **Test 3: Test Database Query** (if configured)

Send:
```
Qual o status da minha assinatura? Meu email é teste@exemplo.com
```

Expected: AI should query the database and respond with subscription info

---

## 📊 STEP 6: Monitor Executions

### View Execution Details

1. Go to **"Executions"** in n8n sidebar
2. Click on any execution to see:
   - ✅ Input data from WAHA
   - ✅ AI processing
   - ✅ Database queries (if used)
   - ✅ Response sent back to WhatsApp

### Execution Status

- 🟢 **Success**: Everything worked
- 🔴 **Error**: Something failed (check error details)
- 🔵 **Running**: Currently processing

---

## 🔧 TROUBLESHOOTING

### Workflow not receiving messages?

**Check:**
1. ✅ Workflow is **ACTIVE** (green toggle)
2. ✅ WAHA webhook is configured: `http://n8n:5678/webhook/whatsapp`
3. ✅ WhatsApp session status is **"WORKING"**

**Fix:**
```bash
# Restart n8n
docker-compose restart n8n

# Check logs
docker-compose logs n8n
```

### AI not responding?

**Check:**
1. ✅ Google Gemini API key is valid
2. ✅ API has quota available
3. ✅ Credentials are saved

**Fix:**
- Re-enter the API key
- Check Google Cloud Console for quota

### Database queries failing?

**Check:**
1. ✅ PostgreSQL credentials are correct
2. ✅ Table `subscriptions` exists
3. ✅ SSL is enabled

**Fix:**
- Test the connection in the PostgreSQL node
- Verify credentials in Vercel dashboard

---

## 📝 WORKFLOW STRUCTURE

```
┌─────────────────────────────────────────────────────────┐
│  1. Webhook WhatsApp (Receives message from WAHA)       │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────┐
│  2. Google Gemini Chat (AI processes message)           │
│     ├─ System Prompt                                    │
│     ├─ User Message                                     │
│     └─ Tools: Database Query (optional)                 │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────┐
│  3. Consultar Banco (Optional - Query database)         │
│     └─ SELECT * FROM subscriptions WHERE...             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────┐
│  4. Enviar WhatsApp (Send response via WAHA)            │
│     └─ POST to http://waha:3000/api/sendText            │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST

- [ ] n8n dashboard accessible (http://localhost:5678)
- [ ] Logged in to n8n (admin/admin)
- [ ] Workflow imported from `workflow_import.json`
- [ ] Google Gemini API key configured
- [ ] PostgreSQL credentials configured (optional)
- [ ] Workflow saved
- [ ] Workflow activated (green toggle)
- [ ] Test message sent to WhatsApp
- [ ] Execution appears in n8n
- [ ] Response received on WhatsApp

---

## 🎯 NEXT STEPS AFTER SETUP

Once the workflow is active and tested:

1. ✅ **Customize the AI prompt** for your business needs
2. ✅ **Add more database queries** if needed
3. ✅ **Monitor executions** regularly
4. ✅ **Adjust responses** based on customer feedback

---

## 🔑 IMPORTANT CREDENTIALS

### n8n
- URL: http://localhost:5678
- Username: `admin`
- Password: `admin`

### Google Gemini API
- API Key: `AIzaSyDxmoCXt87HDkmrjOJHm5wFqTK_9GOLMuU`

### Vercel Postgres (Optional)
- Host: `ep-steep-mountain-ahs14gfe-pooler.c-3.us-east-1.aws.neon.tech`
- Database: `neondb`
- User: `neondb_owner`
- Password: `npg_5AnqXwszBSt9`
- Port: `5432`
- SSL: Enabled

---

## 📞 SUPPORT

If you encounter issues:

1. Check **Executions** in n8n for error details
2. Check **Docker logs**: `docker-compose logs n8n`
3. Verify **WAHA webhook** is configured correctly
4. Ensure **WhatsApp session** is active

---

**Ready to import the workflow? Let's do it!** 🚀

**File to import**: `d:\Antigravity\olinshop\workflow_import.json`
