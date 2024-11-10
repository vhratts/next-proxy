// pages/api/[...path].js

import dynamicProxy from "../../middlewares/proxy-middleware.js";

export default async function handler(req, res) {
  // Chama o middleware de proxy dinâmico
  // Configura os headers de CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite qualquer origem
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Authorization, Content-Type, Referer, User-Agent",
  );

  // Para requisições OPTIONS (pré-flight), apenas retorna o status 200
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  await dynamicProxy(req, res);
}
