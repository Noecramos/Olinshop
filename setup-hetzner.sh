#!/bin/bash

# Clean Setup Script for Hetzner VPS (65.108.154.16)

# Configuration
VPS_IP="65.108.154.16"

# 1. Update System
echo "Updating system..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Docker & Docker Compose
echo "Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Create Directory Structure
echo "Setting up directories..."
mkdir -p ~/ai-agent
cd ~/ai-agent
mkdir -p n8n_data waha_data postgres_data

# 4. Create .env file
echo "Creating .env file..."
cat <<EOF > .env
DOMAIN_OR_IP=$VPS_IP
POSTGRES_USER=n8n
POSTGRES_PASSWORD=n8n_password
POSTGRES_DB=n8n
N8N_USER=admin
N8N_PASSWORD=admin
TIMEZONE=America/Sao_Paulo
WAHA_USER=admin
WAHA_PASSWORD=admin
EOF

# 5. Create docker-compose.yml
echo "Creating docker-compose.yml..."
cat <<EOF > docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    volumes:
      - ./postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U \${POSTGRES_USER}" ]
      interval: 10s
      timeout: 5s
      retries: 5

  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    restart: always
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=db
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=\${POSTGRES_DB}
      - DB_POSTGRESDB_USER=\${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=\${POSTGRES_PASSWORD}
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=\${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=\${N8N_PASSWORD}
      - N8N_SECURE_COOKIE=false
      - N8N_HOST=\${DOMAIN_OR_IP}
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://\${DOMAIN_OR_IP}:5678/
      - GENERIC_TIMEZONE=\${TIMEZONE}
    ports:
      - "5678:5678"
    volumes:
      - ./n8n_data:/home/node/.n8n
    depends_on:
      db:
        condition: service_healthy

  waha:
    image: devlikeapro/waha:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - WAHA_CORE_PORT=3000
      - WAHA_WEBHOOK_URL=http://n8n:5678/webhook/whatsapp
      - WHATSAPP_SWAGGER_USERNAME=\${WAHA_USER}
      - WHATSAPP_SWAGGER_PASSWORD=\${WAHA_PASSWORD}
    volumes:
      - ./waha_data:/app/.sessions
EOF

# 6. Start Services
echo "Starting services..."
docker compose up -d

echo "----------------------------------------"
echo "Setup Complete!"
echo "n8n is running at: http://$VPS_IP:5678"
echo "WAHA is running at: http://$VPS_IP:3000/dashboard"
echo "----------------------------------------"
