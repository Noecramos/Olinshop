# 🚀 WAHA Setup Guide - Step by Step

## ✅ Step 1: You're Logged In! (DONE)

Great! Now let's configure WAHA.

---

## 📱 Step 2: Create WhatsApp Session

### 2.1. Create a New Session

1. In the WAHA Dashboard, look for a button that says:
   - **"+ Add Session"** or
   - **"+ Create Session"** or
   - **"New Session"**

2. Click that button

### 2.2. Configure Session Settings

You'll see a form. Fill it in:

```
Session Name:    default
Engine:          WEBJS (recommended)
                 or NOWEB (alternative)
```

**Important**: Use `default` as the session name - this matches the n8n workflow configuration!

3. Click **"Create"** or **"Start Session"**

---

## 📲 Step 3: Connect Your WhatsApp

### 3.1. Wait for QR Code

After creating the session, you should see:
- A **QR Code** displayed on screen
- Or a button to **"Show QR Code"** or **"Get QR"**

### 3.2. Scan QR Code with WhatsApp Business

**On your phone** (WhatsApp Business number: **+55 81 8392-0320**):

1. Open **WhatsApp Business** app
2. Tap the **⋮** (three dots) menu → **Settings**
3. Tap **Linked Devices** (or **WhatsApp Web/Desktop**)
4. Tap **"Link a Device"**
5. **Scan the QR Code** shown in WAHA Dashboard
6. Wait for confirmation

### 3.3. Verify Connection

After scanning, the session status should change to:
- ✅ **"WORKING"** (green) - Perfect!
- ✅ **"CONNECTED"** (green) - Perfect!
- ✅ **"AUTHENTICATED"** - Perfect!

If you see:
- ❌ **"FAILED"** or **"STOPPED"** - Click "Restart Session" and try again
- ⏳ **"STARTING"** - Wait a few seconds

---

## 🔗 Step 4: Configure Webhook (Connect to n8n)

### 4.1. Access Webhook Settings

In WAHA Dashboard:
1. Click on your **"default"** session
2. Look for one of these tabs/sections:
   - **"Webhooks"**
   - **"Settings"**
   - **"Configuration"**
   - Or a **⚙️ Settings icon**

### 4.2. Set Webhook URL

Find the **Webhook URL** field and enter:

```
http://n8n:5678/webhook/whatsapp
```

**Alternative** (if the above doesn't work):
```
http://localhost:5678/webhook/whatsapp
```

**Why "n8n" instead of "localhost"?**
- Because WAHA and n8n are in the same Docker network
- Docker containers can communicate using service names
- "n8n" is the service name in docker-compose.yml

### 4.3. Select Webhook Events

Enable these events (check the boxes):
- ✅ **message**
- ✅ **message.any**
- ✅ **session.status** (optional, but recommended)

### 4.4. Save Configuration

Click **"Save"** or **"Update"** button

---

## 🧪 Step 5: Test the Webhook (Optional but Recommended)

Some WAHA versions have a "Test Webhook" button:
1. Look for **"Test Webhook"** or **"Send Test"**
2. Click it
3. Check if n8n receives the test message

**To verify in n8n**:
1. Open http://localhost:5678
2. Login with: admin / admin
3. Click **"Executions"** in the sidebar
4. You should see a new execution if the test worked

---

## ✅ Step 6: Verify Everything is Working

### Quick Test:
1. Send a message to **+55 81 8392-0320** from another phone
2. Message: `Olá, teste`
3. Check WAHA Dashboard - should show message received
4. Check n8n Executions - should show new execution

---

## 📊 What You Should See Now

### In WAHA Dashboard:
- ✅ Session "default" with status **WORKING** (green)
- ✅ Webhook URL configured
- ✅ Events enabled (message, message.any)

### In n8n (http://localhost:5678):
- ⏳ Workflow ready to import (next step)
- ⏳ Will show executions when messages arrive

---

## 🎯 Next Steps After WAHA Setup

1. **Import n8n Workflow** (I'll help you with this next)
2. **Activate the Workflow**
3. **Test end-to-end** (send message → get AI response)

---

## 🔍 Troubleshooting

### QR Code doesn't appear
```
Solution: Click "Restart Session" or refresh the page
```

### QR Code expired
```
Solution: Click "Get new QR Code" or restart the session
```

### Status shows "FAILED"
```
Solution: 
1. Delete the session
2. Create a new one
3. Scan QR code again
```

### Webhook not working
```
Solution:
1. Verify URL is exactly: http://n8n:5678/webhook/whatsapp
2. Check that n8n is running: docker-compose ps
3. Try alternative URL: http://localhost:5678/webhook/whatsapp
```

### Can't save webhook
```
Solution:
1. Make sure session is WORKING first
2. Try saving webhook after session is connected
```

---

## 📝 Configuration Summary

Here's what you should have configured:

| Setting | Value |
|---------|-------|
| **Session Name** | default |
| **Engine** | WEBJS |
| **Status** | WORKING ✅ |
| **Webhook URL** | http://n8n:5678/webhook/whatsapp |
| **Events** | message, message.any |
| **WhatsApp Number** | +55 81 8392-0320 |

---

## 🎉 When You're Done

Let me know when you've:
- ✅ Created the "default" session
- ✅ Scanned the QR code
- ✅ Status shows "WORKING"
- ✅ Configured the webhook URL
- ✅ Enabled the events

Then I'll help you with the **n8n workflow setup**! 🚀

---

**Last Updated**: 20/01/2026 08:55
**Status**: WAHA logged in, ready to configure session
