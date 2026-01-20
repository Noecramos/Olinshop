# Quick Access Script for Docker Services
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Docker Services Quick Access" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if services are running
$n8nRunning = docker ps --filter "name=olinshop-n8n" --format "{{.Names}}" | Select-Object -First 1
$wahaRunning = docker ps --filter "name=olinshop-waha" --format "{{.Names}}" | Select-Object -First 1

if (-not $n8nRunning -or -not $wahaRunning) {
    Write-Host "⚠️  Services not running. Starting..." -ForegroundColor Yellow
    docker-compose up -d
    Start-Sleep -Seconds 5
}

Write-Host "✅ Services are running!" -ForegroundColor Green
Write-Host ""

# Display access URLs
Write-Host "📱 Access URLs:" -ForegroundColor Cyan
Write-Host "   n8n Dashboard:     http://localhost:5678" -ForegroundColor White
Write-Host "   WAHA Dashboard:    http://localhost:3000/dashboard" -ForegroundColor White
Write-Host "   WAHA API Docs:     http://localhost:3000/api" -ForegroundColor White
Write-Host ""

Write-Host "🔑 Credentials:" -ForegroundColor Cyan
Write-Host "   n8n:   admin / admin" -ForegroundColor White
Write-Host "   WAHA:  admin / admin" -ForegroundColor White
Write-Host ""

# Ask what to open
Write-Host "What would you like to open?" -ForegroundColor Yellow
Write-Host "1. n8n Dashboard" -ForegroundColor White
Write-Host "2. WAHA Dashboard" -ForegroundColor White
Write-Host "3. WAHA API Docs" -ForegroundColor White
Write-Host "4. View logs" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "Opening n8n Dashboard..." -ForegroundColor Green
        Start-Process "http://localhost:5678"
    }
    "2" {
        Write-Host "Opening WAHA Dashboard..." -ForegroundColor Green
        Start-Process "http://localhost:3000/dashboard"
    }
    "3" {
        Write-Host "Opening WAHA API Docs..." -ForegroundColor Green
        Start-Process "http://localhost:3000/api"
    }
    "4" {
        Write-Host "Showing logs (Ctrl+C to exit)..." -ForegroundColor Green
        docker-compose logs -f
    }
    "5" {
        Write-Host "Goodbye!" -ForegroundColor Cyan
        exit
    }
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
    }
}
