$env:DOMAIN_OR_IP = "localhost"
$env:POSTGRES_USER = "n8n"
$env:POSTGRES_PASSWORD = "n8n_password"
$env:POSTGRES_DB = "n8n"
$env:N8N_USER = "admin"
$env:N8N_PASSWORD = "admin"
$env:TIMEZONE = "America/Sao_Paulo"
$env:WAHA_USER = "admin"
$env:WAHA_PASSWORD = "admin"

Write-Host "Starting AI Agent locally..."
docker compose --env-file .env.local_docker up -d

Write-Host "----------------------------------------"
Write-Host "Local Setup Complete!"
Write-Host "n8n is running at: http://localhost:5678"
Write-Host "WAHA is running at: http://localhost:3000/dashboard"
Write-Host "----------------------------------------"
