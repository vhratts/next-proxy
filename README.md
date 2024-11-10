# Middleware Proxy Dinâmico em Next.js

Essa configuração permite que sua API Next.js funcione como um proxy dinâmico, redirecionando requisições para um domínio de destino especificado no cabeçalho `proxied-domain`. O middleware usa o pacote `http-proxy-middleware` para simplificar o redirecionamento.

## Requisitos

- Node.js 14+ e Next.js
- Pacote `http-proxy-middleware`

### Instalação

Primeiro, instale o pacote `http-proxy-middleware`:

```bash
npm install http-proxy-middleware
```

## Estrutura de Arquivos

1. **middleware.js**: Arquivo responsável por configurar o proxy dinâmico.
2. **pages/api/[...path].js**: Endpoint que captura as rotas dinâmicas e aplica o middleware de proxy.

### Estrutura do Projeto

```plaintext
project-root/
│
├── middleware.js               # Configuração do middleware proxy
└── pages/
    └── api/
        └── [...path].js        # Endpoint de API dinâmico
```

## Configuração do Proxy

### middleware.js

O arquivo `middleware.js` contém a lógica de proxy. Ele lê o cabeçalho `proxied-domain` para definir o `target` do proxy dinamicamente.

```javascript
// middleware.js
import { createProxyMiddleware } from 'http-proxy-middleware';

const dynamicProxy = async (req, res) => {
  const targetDomain = req.headers['proxied-domain'];

  // Valida o domínio de destino
  if (!targetDomain || typeof targetDomain !== 'string' || !/^https?:\/\//.test(targetDomain)) {
    res.status(400).json({ error: 'Cabeçalho "proxied-domain" é obrigatório e deve ser uma URL válida com http ou https.' });
    return;
  }

  // Configura o middleware do proxy
  const proxy = createProxyMiddleware({
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  });

  return new Promise((resolve, reject) => {
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        console.error("Erro no proxy:", result);
        res.status(500).json({ error: "Erro ao redirecionar a requisição" });
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
};

export default dynamicProxy;
```

### pages/api/[...path].js

Esse arquivo configura o endpoint dinâmico que chama o `dynamicProxy` para redirecionar as requisições.

```javascript
// pages/api/[...path].js

import dynamicProxy from '../../middleware';

export default async function handler(req, res) {
  await dynamicProxy(req, res);
}
```

## Como Usar

1. **Faça uma requisição para um endpoint da API Next.js**: Você pode fazer uma requisição `GET`, `POST`, ou outro método para qualquer endpoint em `/api`.

2. **Inclua o cabeçalho `proxied-domain`**: O cabeçalho `proxied-domain` é obrigatório. Ele deve conter a URL completa do domínio de destino, incluindo `http://` ou `https://`.

### Exemplos de Requisição

#### Exemplo de Requisição GET

```bash
curl -X GET https://application.vercel.app/api/some/endpoint \
  -H "proxied-domain: https://api.domain.com"
```

A requisição acima redirecionará para `https://api.domain.com/some/endpoint`.

#### Exemplo de Requisição POST com Dados JSON

```bash
curl -X POST https://application.vercel.app/api/another/endpoint \
  -H "proxied-domain: https://api.domain.com" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

Esse comando redirecionará para `https://api.domain.com/another/endpoint`, enviando o payload JSON.

### Notas Importantes

- **Validação do Domínio**: O middleware verifica se o valor do cabeçalho `proxied-domain` é uma URL válida. Requisições sem esse cabeçalho ou com um valor inválido retornarão um erro `400`.
- **`pathRewrite`**: Se necessário, o prefixo `/api` é removido da URL antes de redirecionar para o domínio de destino.

## Tratamento de Erros

Caso o domínio de destino seja inválido ou o proxy não consiga redirecionar a requisição, a API Next.js responderá com:

- **Erro 400**: Se o cabeçalho `proxied-domain` estiver ausente ou não for uma URL válida.
- **Erro 500**: Se houver falha no redirecionamento pelo proxy.
