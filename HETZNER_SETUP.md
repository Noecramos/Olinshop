# Guia de Instalação: Hetzner VPS

Este guia fornece os passos para uma instalação limpa do docker, n8n e WAHA no seu novo VPS da Hetzner.

## Pré-requisitos
- Um VPS na Hetzner (Ubuntu 20.04 ou 22.04 é recomendado).
- Acesso SSH ao VPS.

## Instalação Rápida (Script Automatizado)

Você pode usar o script `setup-hetzner.sh` que preparamos. Siga estes passos:

1.  **Copie o script para o servidor**:
    Se você estiver no Windows, pode abrir o arquivo `setup-hetzner.sh`, copiar o conteúdo, e no servidor fazer:
    ```bash
    nano setup-hetzner.sh
    # Cole o conteúdo (botão direito do mouse geralmente cola)
    # Pressione Ctrl+O para salvar, Enter, e Ctrl+X para sair
    ```

2.  **Dê permissão de execução**:
    ```bash
    chmod +x setup-hetzner.sh
    ```

3.  **Execute o script**:
    ```bash
    ./setup-hetzner.sh
    ```
    O script pedirá o **IP do seu VPS**. Digite-o e pressione Enter.

4.  **Aguarde a finalização**:
    O script irá instalar o Docker, criar os arquivos necessários e iniciar os serviços.

## Verificação

Após a instalação, acesse no seu navegador:

- **n8n**: `http://SEU_IP:5678`
  - Usuário padrão: `admin`
  - Senha padrão: `admin`
  
- **WAHA**: `http://SEU_IP:3000/dashboard`
  - Usuário padrão: `admin`
  - Senha padrão: `admin`

## Configuração Segura (Opcional)

Os arquivos de configuração ficam na pasta `~/ai-agent`.
Para alterar senhas ou configurações:
1. `cd ~/ai-agent`
2. Edite o arquivo `.env`: `nano .env`
3. Reinicie os serviços: `docker compose up -d`
