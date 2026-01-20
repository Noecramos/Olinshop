Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           DIAGNOSTIC CHECK - What's Not Working?" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking services..." -ForegroundColor Yellow
Write-Host ""

# Check n8n
Write-Host "1. Checking n8n..." -ForegroundColor Yellow
try {
    $n8n = Invoke-WebRequest -Uri "http://localhost:5678" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ n8n is accessible" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ n8n is NOT accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Check WAHA
Write-Host "2. Checking WAHA..." -ForegroundColor Yellow
try {
    $waha = Invoke-WebRequest -Uri "http://localhost:3000/api" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ WAHA is accessible" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ WAHA is NOT accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Check Docker containers
Write-Host "3. Checking Docker containers..." -ForegroundColor Yellow
$containers = docker ps --format "{{.Names}}" 2>$null
if ($containers) {
    Write-Host "   ✅ Docker containers running:" -ForegroundColor Green
    docker ps --format "   - {{.Names}} ({{.Status}})"
}
else {
    Write-Host "   ❌ No Docker containers running" -ForegroundColor Red
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    WHAT TO CHECK NEXT" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Please tell me which of these is the problem:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  A. Can't access n8n dashboard (http://localhost:5678)" -ForegroundColor White
Write-Host "  B. Can't import workflow in n8n" -ForegroundColor White
Write-Host "  C. Workflow imported but not active" -ForegroundColor White
Write-Host "  D. Workflow active but not receiving messages" -ForegroundColor White
Write-Host "  E. Workflow receives but doesn't respond" -ForegroundColor White
Write-Host "  F. WhatsApp not connected to WAHA" -ForegroundColor White
Write-Host "  G. Other issue" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "Enter letter (A-G) or describe the issue"

Write-Host ""
Write-Host "You selected: $choice" -ForegroundColor Cyan
Write-Host ""

switch ($choice.ToUpper()) {
    "A" {
        Write-Host "SOLUTION for 'Can't access n8n':" -ForegroundColor Yellow
        Write-Host "1. Check if n8n container is running: docker ps" -ForegroundColor White
        Write-Host "2. Restart n8n: docker-compose restart n8n" -ForegroundColor White
        Write-Host "3. Check logs: docker-compose logs n8n" -ForegroundColor White
    }
    "B" {
        Write-Host "SOLUTION for 'Can't import workflow':" -ForegroundColor Yellow
        Write-Host "1. Make sure you're logged in to n8n" -ForegroundColor White
        Write-Host "2. Click three dots menu (⋮) in top right" -ForegroundColor White
        Write-Host "3. Select 'Import from File'" -ForegroundColor White
        Write-Host "4. Choose: d:\Antigravity\olinshop\workflow-simple.json" -ForegroundColor White
    }
    "C" {
        Write-Host "SOLUTION for 'Workflow not active':" -ForegroundColor Yellow
        Write-Host "1. Open the workflow in n8n" -ForegroundColor White
        Write-Host "2. Click the toggle switch in top right" -ForegroundColor White
        Write-Host "3. It should turn GREEN" -ForegroundColor White
        Write-Host "4. Click 'Save'" -ForegroundColor White
    }
    "D" {
        Write-Host "SOLUTION for 'Not receiving messages':" -ForegroundColor Yellow
        Write-Host "1. Check WAHA webhook is configured" -ForegroundColor White
        Write-Host "2. URL should be: http://n8n:5678/webhook/whatsapp" -ForegroundColor White
        Write-Host "3. Check WhatsApp session is WORKING" -ForegroundColor White
        Write-Host "4. Send test message to: +55 81 8392-0320" -ForegroundColor White
    }
    "E" {
        Write-Host "SOLUTION for 'Doesn't respond':" -ForegroundColor Yellow
        Write-Host "1. Check n8n Executions for errors" -ForegroundColor White
        Write-Host "2. Click on failed execution to see details" -ForegroundColor White
        Write-Host "3. Check Google Gemini API key is valid" -ForegroundColor White
        Write-Host "4. Check WAHA is sending responses" -ForegroundColor White
    }
    "F" {
        Write-Host "SOLUTION for 'WhatsApp not connected':" -ForegroundColor Yellow
        Write-Host "1. Go to WAHA dashboard: http://localhost:3000/dashboard" -ForegroundColor White
        Write-Host "2. Check session 'default' status" -ForegroundColor White
        Write-Host "3. If not WORKING, restart session" -ForegroundColor White
        Write-Host "4. Scan QR code with WhatsApp Business" -ForegroundColor White
    }
    default {
        Write-Host "Please describe the issue in detail:" -ForegroundColor Yellow
        Write-Host "- What step are you on?" -ForegroundColor White
        Write-Host "- What error message do you see?" -ForegroundColor White
        Write-Host "- What have you tried?" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
