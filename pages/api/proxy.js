import Cors from "cors";
import customProxyMiddleware from "../../middlewares/axios-proxy-middleware.js";

// Configura o middleware CORS
const cors = Cors({
  origin: "*", // Permitir qualquer origem
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
    "User-Agent",
  ],
  // credentials: true,
});

// Helper para executar o middleware de forma assíncrona
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  try {
    // Executa o middleware CORS antes de processar a requisição
    await runMiddleware(req, res, cors);

    // Verifica se a requisição é OPTIONS e retorna 200
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    // Chama o middleware de proxy dinâmico
    // await dynamicProxy(req, res);
    await customProxyMiddleware(req, res);
  } catch (error) {
    console.error("Erro no middleware CORS ou no proxy:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
