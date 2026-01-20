# ULTRA SIMPLE SETUP - GUARANTEED TO WORK

This is the SIMPLEST possible setup. No AI, no complex processing.
Just: receive message → send it back.

## WHAT YOU NEED TO DO:

### STEP 1: Import the Echo Bot

1. Open n8n: http://localhost:5678
2. Login: admin / admin
3. Click ⋮ menu → "Import from File"
4. Select: d:\Antigravity\olinshop\workflow-echo.json
5. Click "Open"

### STEP 2: Activate It

1. Click "Save" button
2. Click the toggle switch to make it GREEN
3. Done!

### STEP 3: Configure WAHA Webhook

1. Open WAHA: http://localhost:3000/dashboard
2. Click on "default" session
3. Find "Webhooks" or "Settings"
4. Set webhook URL to: http://n8n:5678/webhook/whatsapp
5. Enable events: message, message.any
6. Click "Save"

### STEP 4: Test It

1. Send WhatsApp message to: +55 81 8392-0320
2. Message: "teste"
3. You should get back: "Olá! Recebi sua mensagem: teste"

## WHAT THIS DOES:

This workflow simply echoes back whatever you send:
- You send: "Hello"
- Bot replies: "Olá! Recebi sua mensagem: Hello"

## WHY THIS WORKS:

- Only 2 nodes (super simple)
- No AI processing (no API keys needed)
- No database (no credentials needed)
- Just receives and sends back

## IF THIS DOESN'T WORK:

Then the problem is NOT the workflow, it's:
1. WAHA not connected to WhatsApp
2. WAHA webhook not configured
3. n8n not running
4. Network issue between containers

## TROUBLESHOOTING:

### Check 1: Is n8n running?
```
docker ps | findstr n8n
```

### Check 2: Is WAHA running?
```
docker ps | findstr waha
```

### Check 3: Is WhatsApp connected?
- Go to WAHA dashboard
- Check if "default" session shows "WORKING"

### Check 4: Test the webhook directly
```
curl -X POST http://localhost:5678/webhook/whatsapp -H "Content-Type: application/json" -d "{\"body\":{\"payload\":{\"from\":\"test\",\"body\":\"test\"}}}"
```

## NEXT STEPS:

Once this simple echo bot works, we can add:
1. AI processing (Google Gemini)
2. Database queries
3. More complex logic

But first, let's get THIS working!

═══════════════════════════════════════════════════════════════

IMPORT FILE: workflow-echo.json
WEBHOOK URL: http://n8n:5678/webhook/whatsapp

═══════════════════════════════════════════════════════════════
