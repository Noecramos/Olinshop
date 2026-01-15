# 📖 Manual do Lojista - OlinShop

**Versão 1.0 - Janeiro 2025**

Bem-vindo ao OlinShop! Este manual irá guiá-lo através de todas as funcionalidades do painel administrativo da sua loja.

---

## 📋 Índice

1. [Acesso ao Painel](#1-acesso-ao-painel)
2. [Visão Geral do Painel](#2-visão-geral-do-painel)
3. [Gerenciamento de Produtos](#3-gerenciamento-de-produtos)
4. [Gerenciamento de Categorias](#4-gerenciamento-de-categorias)
5. [Configurações da Loja](#5-configurações-da-loja)
6. [Gerenciamento de Pedidos](#6-gerenciamento-de-pedidos)
7. [Dicas e Boas Práticas](#7-dicas-e-boas-práticas)
8. [Solução de Problemas](#8-solução-de-problemas)

---

## 1. Acesso ao Painel

### 1.1 Como Acessar

1. Acesse: `https://olinshop.vercel.app/admin`
2. Digite o **identificador da sua loja** (slug)
   - Exemplo: `multicapas_pe`
3. Digite a **senha** fornecida pelo administrador
4. Clique em **"Acessar Painel"**

### 1.2 Recuperação de Senha

- Se você esqueceu sua senha, entre em contato com o administrador master
- Não há opção de recuperação automática por segurança

### 1.3 Primeiro Acesso

No primeiro acesso, você verá:
- **Dashboard** com estatísticas da loja
- **Abas de navegação** no topo
- **Menu lateral** (em telas grandes)

---

## 2. Visão Geral do Painel

### 2.1 Abas Principais

O painel possui 4 abas principais:

| Aba | Função |
|-----|--------|
| **📊 Painel** | Visão geral, estatísticas e pedidos recentes |
| **📦 Produtos** | Gerenciar produtos da loja |
| **🏷️ Categorias** | Criar e organizar categorias |
| **⚙️ Ajustes** | Configurações da loja |

### 2.2 Status da Loja

No topo do painel, você pode:
- **🟢 LOJA ABERTA**: Sua loja está visível para clientes
- **🔴 LOJA FECHADA**: Sua loja está oculta

**Como Alterar:**
1. Vá para a aba **"Ajustes"**
2. Clique no botão de status no topo
3. Confirme a alteração

---

## 3. Gerenciamento de Produtos

### 3.1 Adicionar Novo Produto

1. Clique na aba **"📦 Produtos"**
2. Clique no botão **"+ Adicionar Produto"**
3. Preencha os campos:

#### Campos Obrigatórios:
- **Nome do Produto**: Nome claro e descritivo
  - ✅ Exemplo: "Camiseta Oversized Preta"
  - ❌ Evite: "Produto 1"

- **Preço**: Valor em reais
  - Exemplo: `89.90`
  - Use ponto para decimais

- **Categoria**: Selecione uma categoria existente
  - Se não houver categorias, crie uma primeiro

#### Campos Opcionais:
- **Descrição**: Detalhes sobre o produto
  - Tamanhos disponíveis
  - Materiais
  - Cores
  - Instruções de uso

- **Imagem**: Foto do produto
  - Clique em **"📷 Upload Imagem"**
  - Formatos aceitos: JPG, PNG, WEBP
  - Tamanho recomendado: até 2MB
  - Resolução ideal: 800x800px

- **Estoque**: Quantidade disponível
  - Deixe em branco para estoque ilimitado
  - Digite um número para controle de estoque

4. Clique em **"Salvar Produto"**

### 3.2 Editar Produto

1. Na lista de produtos, clique em **"✏️ Editar"**
2. Modifique os campos desejados
3. Clique em **"Salvar Alterações"**

### 3.3 Excluir Produto

1. Na lista de produtos, clique em **"🗑️ Excluir"**
2. Confirme a exclusão
3. ⚠️ **Atenção**: Esta ação não pode ser desfeita!

### 3.4 Dicas para Produtos

✅ **Boas Práticas:**
- Use fotos de alta qualidade
- Escreva descrições detalhadas
- Mantenha preços atualizados
- Organize produtos em categorias
- Atualize o estoque regularmente

❌ **Evite:**
- Fotos borradas ou de baixa qualidade
- Descrições vagas ou incompletas
- Produtos sem categoria
- Preços incorretos

---

## 4. Gerenciamento de Categorias

### 4.1 Criar Nova Categoria

1. Clique na aba **"🏷️ Categorias"**
2. Clique em **"+ Adicionar Categoria"**
3. Digite o **nome da categoria**
   - Exemplos: "Camisetas", "Calças", "Acessórios"
4. Clique em **"Salvar"**

### 4.2 Editar Categoria

1. Na lista de categorias, clique em **"✏️ Editar"**
2. Altere o nome
3. Clique em **"Salvar"**

### 4.3 Excluir Categoria

1. Clique em **"🗑️ Excluir"** ao lado da categoria
2. Confirme a exclusão
3. ⚠️ **Atenção**: Produtos desta categoria ficarão sem categoria!

### 4.4 Organização de Categorias

**Sugestões de Categorias por Tipo de Loja:**

**Moda & Vestuário:**
- Camisetas
- Calças
- Vestidos
- Acessórios
- Calçados

**Eletrônicos:**
- Smartphones
- Acessórios
- Áudio
- Informática

**Beleza:**
- Maquiagem
- Skincare
- Cabelos
- Perfumes

**Casa & Decoração:**
- Decoração
- Cozinha
- Quarto
- Banheiro

---

## 5. Configurações da Loja

### 5.1 Identidade da Loja

#### Logo
1. Vá para **"⚙️ Ajustes"**
2. Na seção **"🏪 Identidade da Loja"**
3. Clique no ícone **📷** sobre o logo
4. Selecione uma imagem
5. Aguarde o upload

**Especificações:**
- Formato: PNG (fundo transparente recomendado)
- Tamanho: até 2MB
- Resolução: 512x512px ideal

#### Link Exclusivo (URL)
- **Somente leitura** - não pode ser alterado
- Formato: `https://olinshop.vercel.app/loja/seu-slug`
- Apenas o administrador master pode alterar

#### Nome da Loja
- Nome que aparece para os clientes
- Pode ser alterado a qualquer momento

#### Segmento
- Escolha o tipo de loja:
  - Loja (Geral)
  - Moda e Acessórios
  - Eletrônicos e Tech
  - Beleza e Cosméticos
  - Restaurante / Comida
  - Outro

### 5.2 Contato e Equipe

#### WhatsApp para Pedidos
- Número que receberá os pedidos
- Formato: `(81) 99999-9999`
- O código do país (+55) é adicionado automaticamente

#### Instagram
- Usuário do Instagram (opcional)
- Formato: `@sua_loja`

#### Responsável
- Nome do responsável pela loja

#### E-mail Administrativo
- E-mail para comunicações importantes

### 5.3 Logística de Entrega

#### Tempo Estimado
- Tempo médio de entrega
- Exemplo: `30-50 min` ou `1-2 dias`

#### Raio Máximo (km)
- Distância máxima de entrega
- Exemplo: `10` (para 10km)

#### Taxas por Distância
Configure até 4 faixas de taxa de entrega:

| Até (km) | Taxa (R$) |
|----------|-----------|
| 3 | 5.00 |
| 5 | 8.00 |
| 8 | 12.00 |
| 10 | 15.00 |

**Como Configurar:**
1. Digite a distância máxima em km
2. Digite a taxa correspondente
3. Repita para até 4 faixas
4. Deixe em branco as faixas não utilizadas

### 5.4 Localização

#### CEP
- CEP da sua loja
- Formato: `53000-000`

#### Endereço Completo
- Endereço completo da loja
- Usado para cálculo de distância

#### Coordenadas GPS (Latitude e Longitude)
**Sincronização Automática:**
1. Preencha o endereço completo
2. Clique em **"📍 Sincronizar GPS com Endereço"**
3. As coordenadas serão preenchidas automaticamente

**Para que serve?**
- Cálculo automático da taxa de entrega por distância
- Validação da área de entrega

### 5.5 Operação e Pagamento

#### Chave PIX
- Sua chave PIX para receber pagamentos
- Pode ser: CPF, Celular, E-mail ou Chave Aleatória
- Será exibida para o cliente no checkout

#### Horário de Funcionamento
- Horários de atendimento
- Exemplo: `Seg a Sex: 08h às 18h`

### 5.6 Salvar Alterações

⚠️ **IMPORTANTE:**
- Após fazer qualquer alteração, role até o final da página
- Clique no botão **"💾 Salvar Todas as Alterações"**
- Aguarde a confirmação de sucesso

---

## 6. Gerenciamento de Pedidos

### 6.1 Visualizar Pedidos

Na aba **"📊 Painel"**, você verá:
- **Últimos Pedidos**: Pedidos recentes pendentes
- **Histórico**: Pedidos já processados

### 6.2 Status dos Pedidos

Os pedidos passam por 3 status:

| Status | Significado | Ação |
|--------|-------------|------|
| 🟡 **Pendente** | Novo pedido aguardando aprovação | Aprovar ou Rejeitar |
| 🔵 **Aprovado** | Pedido confirmado, em preparo | Marcar como Enviado |
| 🟢 **Enviado** | Pedido concluído | Vai para Histórico |

### 6.3 Processar Pedido

#### Aprovar Pedido
1. Localize o pedido pendente
2. Revise os detalhes:
   - Itens
   - Endereço de entrega
   - Forma de pagamento
   - Observações do cliente
3. Clique em **"✅ Aprovar"**
4. O status muda para **Aprovado**

#### Marcar como Enviado
1. Quando o pedido estiver pronto/enviado
2. Clique em **"📦 Enviar"**
3. O pedido vai para o **Histórico**

### 6.4 Informações do Pedido

Cada pedido mostra:
- **Ticket**: Número único do pedido
- **Cliente**: Nome e telefone
- **Endereço**: Endereço de entrega (se aplicável)
- **Itens**: Lista de produtos e quantidades
- **Total**: Valor total do pedido
- **Pagamento**: Forma de pagamento escolhida
- **Observações**: Comentários do cliente

### 6.5 Comunicação com Cliente

- Todos os pedidos são enviados via **WhatsApp**
- O cliente recebe uma mensagem formatada com todos os detalhes
- Você pode responder diretamente no WhatsApp para:
  - Confirmar o pedido
  - Informar tempo de entrega
  - Solicitar comprovante de pagamento (PIX)
  - Tirar dúvidas

---

## 7. Dicas e Boas Práticas

### 7.1 Gestão de Produtos

✅ **Faça:**
- Atualize o catálogo regularmente
- Remova produtos esgotados
- Use fotos profissionais
- Escreva descrições completas
- Organize por categorias lógicas
- Mantenha preços competitivos

❌ **Evite:**
- Produtos duplicados
- Fotos de baixa qualidade
- Descrições incompletas
- Categorias desorganizadas
- Preços desatualizados

### 7.2 Atendimento ao Cliente

✅ **Faça:**
- Responda rapidamente no WhatsApp
- Confirme pedidos assim que possível
- Seja claro sobre prazos de entrega
- Mantenha o cliente informado
- Seja educado e profissional

❌ **Evite:**
- Demorar para responder
- Ignorar mensagens
- Prometer prazos irreais
- Ser rude ou impaciente

### 7.3 Gestão de Pedidos

✅ **Faça:**
- Verifique pedidos diariamente
- Aprove pedidos rapidamente
- Confirme o endereço de entrega
- Solicite comprovante de PIX
- Atualize status dos pedidos

❌ **Evite:**
- Deixar pedidos pendentes por muito tempo
- Esquecer de atualizar status
- Não confirmar pagamentos

### 7.4 Otimização da Loja

**Para Aumentar Vendas:**
1. **Fotos de Qualidade**: Invista em boas fotos
2. **Descrições Detalhadas**: Quanto mais informação, melhor
3. **Preços Competitivos**: Pesquise a concorrência
4. **Categorias Organizadas**: Facilite a navegação
5. **Atendimento Rápido**: Responda rápido no WhatsApp
6. **Promoções**: Ofereça descontos ocasionais
7. **Estoque Atualizado**: Evite vender produtos esgotados

---

## 8. Solução de Problemas

### 8.1 Não Consigo Fazer Login

**Possíveis Causas:**
- Senha incorreta
- Slug da loja incorreto
- Loja não aprovada pelo administrador

**Solução:**
1. Verifique se digitou o slug corretamente
2. Tente a senha novamente
3. Entre em contato com o administrador master

### 8.2 Imagem Não Carrega

**Possíveis Causas:**
- Arquivo muito grande
- Formato não suportado
- Conexão lenta

**Solução:**
1. Reduza o tamanho da imagem (máx 2MB)
2. Use formatos: JPG, PNG ou WEBP
3. Tente novamente com conexão estável

### 8.3 Produto Não Aparece na Loja

**Possíveis Causas:**
- Loja está fechada
- Produto sem categoria
- Erro ao salvar

**Solução:**
1. Verifique se a loja está **ABERTA**
2. Confirme que o produto tem uma categoria
3. Tente editar e salvar novamente

### 8.4 Pedidos Não Aparecem

**Possíveis Causas:**
- Nenhum pedido novo
- Pedidos já foram processados (estão no histórico)

**Solução:**
1. Verifique a aba **Histórico**
2. Aguarde novos pedidos
3. Certifique-se que a loja está aberta

### 8.5 Taxa de Entrega Não Calcula

**Possíveis Causas:**
- Coordenadas GPS não configuradas
- Taxas por distância não preenchidas

**Solução:**
1. Vá em **Ajustes > Localização**
2. Preencha o endereço completo
3. Clique em **"Sincronizar GPS"**
4. Configure as **Taxas por Distância**
5. Salve as alterações

---

## 📞 Suporte

### Precisa de Ajuda?

**Contato do Administrador Master:**
- Para questões técnicas
- Recuperação de senha
- Alteração de slug da loja
- Problemas com o sistema

**Dicas Rápidas:**
- Sempre salve as alterações antes de sair
- Faça backup das suas fotos de produtos
- Mantenha suas informações atualizadas
- Verifique pedidos diariamente

---

## 🎯 Checklist de Configuração Inicial

Use este checklist ao configurar sua loja pela primeira vez:

- [ ] Fazer login no painel
- [ ] Abrir a loja (Status: ABERTA)
- [ ] Fazer upload do logo
- [ ] Preencher informações de contato
- [ ] Configurar WhatsApp
- [ ] Adicionar endereço completo
- [ ] Sincronizar coordenadas GPS
- [ ] Configurar taxas de entrega
- [ ] Adicionar chave PIX
- [ ] Criar categorias principais
- [ ] Adicionar primeiros produtos
- [ ] Testar fazendo um pedido de teste
- [ ] Verificar se pedido chegou no WhatsApp

---

## 📈 Próximos Passos

Após dominar o básico:

1. **Expanda o Catálogo**: Adicione mais produtos
2. **Organize Categorias**: Crie subcategorias se necessário
3. **Otimize Fotos**: Invista em fotografia profissional
4. **Promova sua Loja**: Divulgue o link nas redes sociais
5. **Monitore Vendas**: Acompanhe estatísticas no painel
6. **Colete Feedback**: Pergunte aos clientes sobre a experiência

---

**Versão do Manual:** 1.0  
**Última Atualização:** Janeiro 2025  
**Plataforma:** OlinShop  

© 2025 OlinShop - Todos os direitos reservados
