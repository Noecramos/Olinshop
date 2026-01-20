Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           N8N WORKFLOW SETUP - QUICK START" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Opening n8n Dashboard..." -ForegroundColor Yellow
Start-Process "http://localhost:5678"

Write-Host ""
Write-Host "✅ n8n Dashboard opened!" -ForegroundColor Green
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                  LOGIN CREDENTIALS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: admin" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "              IMPORT WORKFLOW - 4 STEPS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  STEP 1: Click the ⋮ (three dots) menu" -ForegroundColor Yellow
Write-Host "          (Top right corner)" -ForegroundColor Gray
Write-Host ""
Write-Host "  STEP 2: Select 'Import from File'" -ForegroundColor Yellow
Write-Host ""
Write-Host "  STEP 3: Choose this file:" -ForegroundColor Yellow
Write-Host "          d:\Antigravity\olinshop\workflow_import.json" -ForegroundColor White
Write-Host ""
Write-Host "  STEP 4: Toggle workflow to ACTIVE" -ForegroundColor Yellow
Write-Host "          (Green toggle in top right)" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "              CONFIGURE GOOGLE GEMINI API" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  After importing:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Click 'Google Gemini Chat' node" -ForegroundColor White
Write-Host "  2. Click 'Create New Credential'" -ForegroundColor White
Write-Host "  3. Enter API Key:" -ForegroundColor White
Write-Host ""
Write-Host "     AIzaSyDxmoCXt87HDkmrjOJHm5wFqTK_9GOLMuU" -ForegroundColor Cyan
Write-Host ""
Write-Host "  4. Click 'Save'" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    TEST THE WORKFLOW" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Send a WhatsApp message to: +55 81 8392-0320" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Message: 'Olá, preciso de ajuda'" -ForegroundColor White
Write-Host ""
Write-Host "  Then check:" -ForegroundColor Yellow
Write-Host "  - n8n Executions (left sidebar)" -ForegroundColor White
Write-Host "  - WhatsApp for automatic response" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Full guide: N8N_WORKFLOW_SETUP.md" -ForegroundColor Gray
Write-Host ""
