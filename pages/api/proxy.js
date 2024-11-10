// pages/api/[...path].js

import dynamicProxy from "../../middlewares/proxy-middleware.js";

export default async function handler(req, res) {
  // Chama o middleware de proxy dinâmico
  await dynamicProxy(req, res);
}
