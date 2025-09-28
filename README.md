# Next.js Proxy Server

Um servidor proxy dinâmico construído com Next.js que permite redirecionar requisições HTTP para diferentes domínios usando o cabeçalho `Proxied-Domain`. Ideal para deploy na Vercel e outros serviços de hospedagem.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Exemplos de Uso](#exemplos-de-uso)
- [Configuração](#configuração)
- [Deploy](#deploy)
- [Docker](#docker)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

Este projeto implementa um servidor proxy que atua como intermediário entre clientes e APIs externas. O proxy recebe requisições HTTP e as redireciona para o domínio especificado no cabeçalho `Proxied-Domain`, mantendo todos os dados da requisição original (método, cabeçalhos, corpo, etc.).

### Arquitetura

```
Cliente → Next.js Proxy → API Externa
         (Vercel/Deploy)  (Domínio especificado)
```

## ✨ Funcionalidades

- **Proxy Dinâmico**: Redireciona requisições para qualquer domínio via cabeçalho HTTP
- **Suporte a CORS**: Configurado para aceitar requisições de qualquer origem
- **Múltiplos Métodos HTTP**: Suporte a GET, POST, PUT, OPTIONS
- **Preservação de Dados**: Mantém cabeçalhos, corpo e parâmetros da requisição original
- **Timeout Configurável**: 60 segundos de timeout para requisições
- **Deploy Ready**: Otimizado para Vercel e outros serviços de hospedagem
- **Docker Support**: Containerização completa com Docker

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação Local

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd next-proxy
```

2. Instale as dependências:
```bash
npm install
```

3. Execute em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse: `http://localhost:3000`

## 📖 Como Usar

### Estrutura Básica

O proxy funciona interceptando requisições e redirecionando-as baseado no cabeçalho `Proxied-Domain`:

```bash
curl -X [MÉTODO] https://seu-proxy.vercel.app/api/[endpoint] \
  -H "Proxied-Domain: https://api.dominio-externo.com" \
  -H "Content-Type: application/json" \
  -d '{"dados": "exemplo"}'
```

### Endpoints Disponíveis

- `GET /api/proxy` - Endpoint principal do proxy
- `GET /api/[...path]` - Endpoint catch-all para qualquer rota

## 💡 Exemplos de Uso

### 1. Requisição GET Simples

```bash
curl -X GET https://seu-proxy.vercel.app/api/users \
  -H "Proxied-Domain: https://jsonplaceholder.typicode.com"
```

### 2. Requisição POST com Dados

```bash
curl -X POST https://seu-proxy.vercel.app/api/posts \
  -H "Proxied-Domain: https://jsonplaceholder.typicode.com" \
  -H "Content-Type: application/json" \
  -d '{"title": "Meu Post", "body": "Conteúdo do post", "userId": 1}'
```

### 3. Requisição PUT

```bash
curl -X PUT https://seu-proxy.vercel.app/api/posts/1 \
  -H "Proxied-Domain: https://jsonplaceholder.typicode.com" \
  -H "Content-Type: application/json" \
  -d '{"title": "Post Atualizado", "body": "Conteúdo atualizado"}'
```

### 4. Usando com JavaScript/Fetch

```javascript
const response = await fetch('https://seu-proxy.vercel.app/api/data', {
  method: 'POST',
  headers: {
    'Proxied-Domain': 'https://api.exemplo.com',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer seu-token'
  },
  body: JSON.stringify({
    key: 'value'
  })
});

const data = await response.json();
```

### 5. Usando com Axios

```javascript
import axios from 'axios';

const response = await axios.post(
  'https://seu-proxy.vercel.app/api/endpoint',
  { dados: 'exemplo' },
  {
    headers: {
      'Proxied-Domain': 'https://api.exemplo.com',
      'Content-Type': 'application/json'
    }
  }
);
```

## ⚙️ Configuração

### Cabeçalhos Suportados

O proxy aceita e repassa os seguintes cabeçalhos:

- `Proxied-Domain` (obrigatório) - Domínio de destino
- `Content-Type` - Tipo de conteúdo
- `Authorization` - Autenticação
- `User-Agent` - Identificação do cliente
- `Accept` - Tipos aceitos
- `X-CSRF-Token` - Token CSRF
- `X-Requested-With` - Tipo de requisição
- `Referer` - Referência
- `Origin` - Origem

### Configurações do CORS

```javascript
const cors = Cors({
  origin: "*", // Permite qualquer origem
  methods: ["GET", "OPTIONS", "POST", "PUT"],
  allowedHeaders: [
    "X-CSRF-Token",
    "X-Requested-With", 
    "Accept",
    "Authorization",
    "Content-Type",
    "Referer",
    "Origin",
    "Proxied-Domain",
    "User-Agent"
  ]
});
```

### Timeout

- **Timeout de Requisição**: 60 segundos
- **Timeout de Proxy**: 60 segundos

## 🚀 Deploy

### Deploy na Vercel

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push

### Deploy Manual

```bash
npm run build
npm start
```

### Outros Serviços

O projeto é compatível com:
- Vercel
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🐳 Docker

### Usando Docker Compose

```bash
docker-compose up --build
```

### Usando Docker

```bash
# Build da imagem
docker build -t next-proxy .

# Executar container
docker run -p 2407:3000 next-proxy
```

### Configurações do Docker

- **Porta**: 2407 (host) → 3000 (container)
- **Node.js**: 18-alpine
- **Ambiente**: Produção

## 📚 API Reference

### Endpoints

#### `GET /api/proxy`
Endpoint principal do proxy.

**Headers Obrigatórios:**
- `Proxied-Domain`: URL de destino (ex: `https://api.exemplo.com`)

**Resposta:**
- `200`: Requisição processada com sucesso
- `400`: Cabeçalho `Proxied-Domain` inválido ou ausente
- `500`: Erro interno do servidor

#### `GET /api/[...path]`
Endpoint catch-all para qualquer rota.

**Comportamento:** Redireciona para `/api/proxy`

### Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Cabeçalho `Proxied-Domain` obrigatório e deve ser uma URL válida |
| 500 | Erro interno no servidor ou erro ao redirecionar requisição |

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro 400 - Cabeçalho Proxied-Domain inválido

**Causa:** Cabeçalho ausente ou URL inválida

**Solução:**
```bash
# ✅ Correto
curl -H "Proxied-Domain: https://api.exemplo.com" ...

# ❌ Incorreto
curl -H "Proxied-Domain: api.exemplo.com" ...  # Falta https://
curl ...  # Sem cabeçalho
```

#### 2. Timeout de Requisição

**Causa:** API de destino demora para responder

**Solução:** Ajustar timeout no código (atualmente 60s)

#### 3. Erro de CORS

**Causa:** Configuração de CORS restritiva

**Solução:** Verificar configuração no arquivo `[...path].js`

### Logs

O proxy registra logs no console:
- Redirecionamentos de requisições
- Erros de proxy
- Dados de resposta (em desenvolvimento)

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

Desenvolvido por **vhratts**

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Abrir um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
