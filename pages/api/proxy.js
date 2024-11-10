import Cors from "cors";
import dynamicProxy from "../../middlewares/proxy-middleware.js";

// Inicializa o middleware CORS
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
    "User-Agent",
  ],
  credentials: true,
});

// Helper para rodar o middleware de forma assíncrona
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
  // Aplica o middleware CORS
  await runMiddleware(req, res, cors);

  // Lida com requisições OPTIONS (pré-flight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Chama o middleware de proxy dinâmico
  await dynamicProxy(req, res);
}
