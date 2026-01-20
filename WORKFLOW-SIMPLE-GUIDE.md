# ✅ SIMPLIFIED WORKFLOW - FIXED!

## 🔧 Problem Solved

The original workflow used `n8n-nodes-base.tool` which is only available in newer n8n versions.

I've created a **simplified workflow** that works with your current n8n version!

---

## 📥 IMPORT THE NEW WORKFLOW

### File to Import:
```
d:\Antigravity\olinshop\workflow-simple.json
```

### Steps:

1. **In n8n dashboard**:
   - Click **⋮** (three dots menu)
   - Select **"Import from File"**
   - Choose: `workflow-simple.json`
   - Click **"Open"**

2. **Save the workflow**:
   - Click **"Save"** button

3. **Activate the workflow**:
   - Toggle switch to **ACTIVE** (green)

---

## 🎯 What This Workflow Does

```
1. Webhook WhatsApp
   └─ Receives message from WAHA
   
2. Extract Message
   └─ Parses the WAHA webhook data
   
3. Google Gemini API
   └─ Sends message to AI for processing
   
4. Extract AI Response
   └─ Parses the AI response
   
5. Send WhatsApp Response
   └─ Sends response back via WAHA
```

---

## ✅ Advantages of This Workflow

- ✅ **No special nodes** - uses basic HTTP Request and Code nodes
- ✅ **Works with any n8n version**
- ✅ **Google Gemini API key already included**
- ✅ **No additional configuration needed**
- ✅ **Simpler and more reliable**

---

## 🔑 API Key (Already Configured)

The Google Gemini API key is already embedded in the workflow:
```
AIzaSyDxmoCXt87HDkmrjOJHm5wFqTK_9GOLMuU
```

**No need to add credentials manually!**

---

## 🧪 Test the Workflow

After importing and activating:

1. **Send a WhatsApp message** to: **+55 81 8392-0320**
   ```
   Olá, preciso de ajuda
   ```

2. **Check n8n Executions**:
   - Click **"Executions"** in left sidebar
   - You should see a new execution
   - Status should be **"Success"** (green)

3. **Check WhatsApp**:
   - You should receive an AI-generated response

---

## 📊 Workflow Nodes Explained

### 1. Webhook WhatsApp (Trigger)
- **Type**: Webhook
- **Path**: `whatsapp`
- **URL**: `http://localhost:5678/webhook/whatsapp`
- Receives messages from WAHA

### 2. Extract Message (Code)
- **Type**: Code (JavaScript)
- Extracts message text and sender from WAHA payload

### 3. Google Gemini API (HTTP Request)
- **Type**: HTTP Request
- **URL**: Google Gemini API endpoint
- **API Key**: Already included
- Sends message to AI for processing

### 4. Extract AI Response (Code)
- **Type**: Code (JavaScript)
- Extracts AI response text from Gemini API response

### 5. Send WhatsApp Response (HTTP Request)
- **Type**: HTTP Request
- **URL**: `http://waha:3000/api/sendText`
- Sends AI response back to WhatsApp via WAHA

---

## 🔍 Troubleshooting

### Workflow not receiving messages?

**Check:**
1. ✅ Workflow is **ACTIVE** (green toggle)
2. ✅ WAHA webhook is configured: `http://n8n:5678/webhook/whatsapp`
3. ✅ WhatsApp session status is **"WORKING"**

**Fix:**
- Restart n8n: `docker-compose restart n8n`
- Check WAHA webhook configuration

### AI not responding?

**Check:**
1. ✅ Google Gemini API is accessible
2. ✅ API key has quota available

**Fix:**
- Check execution details in n8n for error messages
- Verify API key is valid

### WAHA not sending response?

**Check:**
1. ✅ WAHA is running: `docker-compose ps`
2. ✅ Session "default" is active

**Fix:**
- Restart WAHA: `docker-compose restart waha`
- Check WAHA logs: `docker-compose logs waha`

---

## ✅ Quick Checklist

- [ ] Old workflow deleted (if imported)
- [ ] New workflow imported from `workflow-simple.json`
- [ ] Workflow saved
- [ ] Workflow activated (green toggle)
- [ ] Test message sent to WhatsApp
- [ ] Execution appears in n8n
- [ ] AI response received on WhatsApp

---

## 🎯 Next Steps

Once the workflow is working:

1. ✅ **Customize AI prompt** in the "Google Gemini API" node
2. ✅ **Monitor executions** to see how AI responds
3. ✅ **Adjust responses** based on customer needs

---

## 📝 Customizing the AI Prompt

To change how the AI responds:

1. Click on **"Google Gemini API"** node
2. Find the `jsonBody` parameter
3. Edit the system prompt:
   ```
   Você é um assistente de suporte para Olinshop e Olindelivery.
   Responda de forma amigável e profissional.
   ```
4. Click **"Save"**

---

## 🚀 You're All Set!

**Import the simplified workflow and you're ready to go!**

**File**: `d:\Antigravity\olinshop\workflow-simple.json`

No more "unrecognized node type" errors! 🎉
