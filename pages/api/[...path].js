// pages/api/[...path].js

export default async function handler(req, res) {
  const { path } = req.query; // Captura o caminho dinâmico a partir da URL
  const proxiedDomain = req.headers["proxied-domain"];
  const url = `https://${proxiedDomain}/${path.join("/")}`; // Constrói a URL para o redirecionamento

  try {
    // Redireciona a requisição original para a URL de destino
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(url).host, // Evita erro de headers com hosts diferentes
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // Captura a resposta do endpoint original
    const data = await response.text();

    // Retorna a resposta ao cliente
    res.status(response.status).send(data);
  } catch (error) {
    res
      .status(500)
      .json({
        error:
          "Erro ao redirecionar a requisição: Parametro de cabeçalho [proxied-domain] ausente ou incorreto! - " +
          error.message,
      });
  }
}
