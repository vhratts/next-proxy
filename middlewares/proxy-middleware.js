// middleware.js
import { createProxyMiddleware } from "http-proxy-middleware";

const dynamicProxy = async (req, res) => {
  // Obtém o domínio de destino do cabeçalho 'proxied-domain'
  const targetDomain = req.headers["proxied-domain"];
  // console.log(req, res)
  // Verifica se o cabeçalho foi fornecido e se é uma URL válida
  if (
    !targetDomain ||
    typeof targetDomain !== "string" ||
    !/^https?:\/\//.test(targetDomain)
  ) {
    res.status(400).json({
      error:
        'Cabeçalho "proxied-domain" é obrigatório e deve ser uma URL válida com http ou https.',
    });
    return;
  }
  console.log(
    `Passando pelo PROXY DInamico: Redirecionando entrada para => ${targetDomain}`,
  );
  // Cria um middleware de proxy dinâmico
  const proxy = createProxyMiddleware({
    target: targetDomain, // Usa o domínio do cabeçalho
    changeOrigin: true,
    pathRewrite: { "^/api": "" }, // Remove o prefixo '/api' (opcional)
  });

  // Executa o proxy
  return new Promise((resolve, reject) => {
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        // console.error("Erro no proxy:", result);
        res.status(500).json({ error: "Erro ao redirecionar a requisição" });
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
};

export default dynamicProxy;
