Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "         FIXING DOCKER NETWORK ISSUES" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "found multiple conflicting containers running on the wrong network." -ForegroundColor Yellow
Write-Host "This is why WAHA cannot talk to n8n." -ForegroundColor Yellow
Write-Host ""

Write-Host "Stopping all containers..." -ForegroundColor Yellow
docker kill $(docker ps -q)
docker rm $(docker ps -a -q)

Write-Host ""
Write-Host "Cleaning up docker system..." -ForegroundColor Yellow
docker system prune -f

Write-Host ""
Write-Host "Restarting services correctly with docker-compose..." -ForegroundColor Green
docker-compose up -d

Write-Host ""
Write-Host "Waiting for services to start (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "Checking running services..." -ForegroundColor Green
docker-compose ps

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "              SERVICES RESTARTED" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please perform the setup steps again:" -ForegroundColor Yellow
Write-Host "1. Open WAHA URL: http://localhost:3000/dashboard" -ForegroundColor White
Write-Host "2. (Re-login might be needed)" -ForegroundColor White
Write-Host "3. Open n8n URL: http://localhost:5678" -ForegroundColor White
Write-Host "4. Check if workflow is active" -ForegroundColor White
Write-Host ""
