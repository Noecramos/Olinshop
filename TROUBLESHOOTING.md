# 🔍 TROUBLESHOOTING GUIDE - What's Not Working?

Let me help you diagnose the issue. Please tell me which of these is happening:

## ❓ What exactly is not working?

### Option 1: Can't access n8n dashboard?
- URL: http://localhost:5678
- Can't login or page won't load?

### Option 2: Can't import the workflow?
- Getting an error when importing?
- What error message do you see?

### Option 3: Workflow imported but not receiving messages?
- Workflow is active (green toggle)?
- Sent test message to WhatsApp?
- No execution showing in n8n?

### Option 4: Workflow receives message but doesn't respond?
- Execution shows in n8n?
- Execution status: Success or Error?
- What error message in the execution?

### Option 5: WhatsApp not connected to WAHA?
- WAHA session status?
- QR code scanned?

---

## 🔧 QUICK DIAGNOSTIC CHECKS

### Check 1: Are services running?

Run this command:
```powershell
docker ps
```

You should see:
- n8n container (port 5678)
- WAHA container (port 3000)
- PostgreSQL container

### Check 2: Can you access the dashboards?

- n8n: http://localhost:5678
- WAHA: http://localhost:3000/dashboard

### Check 3: Is the workflow active?

In n8n:
1. Open the workflow
2. Check if toggle is GREEN (active)
3. If not, click to activate

### Check 4: Is WAHA webhook configured?

In WAHA dashboard:
1. Click "default" session
2. Check webhook URL: `http://n8n:5678/webhook/whatsapp`
3. Events enabled: message, message.any

---

## 🧪 STEP-BY-STEP TEST

Let's test each component:

### Test 1: n8n Webhook

Test if the webhook is accessible:
```powershell
curl -X POST http://localhost:5678/webhook/whatsapp `
  -H "Content-Type: application/json" `
  -d '{\"test\":\"data\"}'
```

Expected: Should see execution in n8n

### Test 2: WAHA API

Test if WAHA is responding:
```powershell
curl http://localhost:3000/api/sessions
```

Expected: Should return session list

### Test 3: End-to-End

1. Send WhatsApp message to: +55 81 8392-0320
2. Message: "teste"
3. Check n8n Executions
4. Check WhatsApp for response

---

## 📋 COMMON ISSUES & FIXES

### Issue: "Workflow not found" or "404"

**Fix:**
1. Make sure workflow is saved
2. Check if workflow is in the list
3. Try importing again

### Issue: "Webhook not responding"

**Fix:**
1. Check workflow is ACTIVE (green toggle)
2. Restart n8n: `docker-compose restart n8n`
3. Check webhook URL in WAHA matches n8n

### Issue: "AI not responding"

**Fix:**
1. Check Google Gemini API key is valid
2. Check API quota in Google Cloud Console
3. Look at execution error in n8n

### Issue: "WAHA not sending message"

**Fix:**
1. Check WAHA session status is "WORKING"
2. Restart WAHA: `docker-compose restart waha`
3. Check WAHA logs: `docker-compose logs waha`

---

## 🔍 DETAILED DIAGNOSTICS

### Get n8n logs:
```powershell
docker-compose logs n8n --tail=50
```

### Get WAHA logs:
```powershell
docker-compose logs waha --tail=50
```

### Check workflow executions:
1. Open n8n: http://localhost:5678
2. Click "Executions" in sidebar
3. Look for recent executions
4. Click on execution to see details

---

## 📞 TELL ME MORE

To help you better, please tell me:

1. **What step are you on?**
   - Importing workflow?
   - Testing workflow?
   - Configuring something?

2. **What error do you see?**
   - Screenshot or error message?
   - Where does it appear?

3. **What have you tried?**
   - Imported the workflow?
   - Activated it?
   - Sent test message?

---

## 🚀 QUICK RESTART (if all else fails)

```powershell
# Stop everything
docker-compose down

# Start everything fresh
docker-compose up -d

# Wait 10 seconds
Start-Sleep -Seconds 10

# Check status
docker-compose ps
```

Then:
1. Access n8n: http://localhost:5678
2. Import workflow: workflow-simple.json
3. Activate workflow
4. Test with WhatsApp message

---

**Please tell me specifically what's not working so I can help you fix it!** 🔧
