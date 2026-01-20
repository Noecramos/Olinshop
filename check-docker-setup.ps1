Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Docker Setup Status Check" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "1. Checking Docker status..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "   ✅ Docker is running" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Docker is not running" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check running containers
Write-Host "2. Checking running containers..." -ForegroundColor Yellow
$containers = docker ps --format "{{.Names}}" | Where-Object { $_ -match "olinshop" }
if ($containers) {
    Write-Host "   ✅ Found containers:" -ForegroundColor Green
    docker ps --filter "name=olinshop" --format "   - {{.Names}} ({{.Status}})"
}
else {
    Write-Host "   ⚠️  No olinshop containers running" -ForegroundColor Yellow
}
Write-Host ""

# Check n8n
Write-Host "3. Checking n8n..." -ForegroundColor Yellow
try {
    $n8nResponse = Invoke-WebRequest -Uri "http://localhost:5678" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ n8n is accessible at http://localhost:5678" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ n8n is not accessible" -ForegroundColor Red
}
Write-Host ""

# Check WAHA
Write-Host "4. Checking WAHA..." -ForegroundColor Yellow
try {
    $wahaResponse = Invoke-WebRequest -Uri "http://localhost:3000/api" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ WAHA is accessible at http://localhost:3000" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ WAHA is not accessible" -ForegroundColor Red
}
Write-Host ""

# Check PostgreSQL
Write-Host "5. Checking PostgreSQL..." -ForegroundColor Yellow
$dbContainer = docker ps --filter "name=olinshop-db" --format "{{.Names}}" | Select-Object -First 1
if ($dbContainer) {
    Write-Host "   ✅ PostgreSQL container is running" -ForegroundColor Green
}
else {
    Write-Host "   ❌ PostgreSQL container is not running" -ForegroundColor Red
}
Write-Host ""

# Display access information
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Access Information" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "n8n Dashboard:    http://localhost:5678" -ForegroundColor White
Write-Host "WAHA Dashboard:   http://localhost:3000/dashboard" -ForegroundColor White
Write-Host "WAHA API Docs:    http://localhost:3000/api" -ForegroundColor White
Write-Host ""
Write-Host "Default Credentials (from .env.local_docker):" -ForegroundColor Yellow
Write-Host "n8n:   admin / admin" -ForegroundColor White
Write-Host "WAHA:  admin / admin" -ForegroundColor White
Write-Host ""

# Next steps
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "1. Access n8n at http://localhost:5678" -ForegroundColor White
Write-Host "2. Access WAHA at http://localhost:3000/dashboard" -ForegroundColor White
Write-Host "3. Connect your WhatsApp by scanning QR code in WAHA" -ForegroundColor White
Write-Host "4. Configure webhook in WAHA to point to n8n" -ForegroundColor White
Write-Host ""
