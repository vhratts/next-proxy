import axios from "axios";

const customProxyMiddleware = async (req, res) => {
  try {
    const targetDomain = req.headers["proxied-domain"];

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

    // Define a URL completa de destino
    const targetUrl = `${targetDomain}${req.url}`;

    // Define o corpo da requisição (para métodos POST, PUT, etc.)
    const requestData = req.method === "GET" ? {} : { data: req.body };

    // Envia a requisição para o domínio de destino usando axios
    const response = await axios({
      url: targetUrl,
      method: req.method,
      headers: { ...req.headers, host: new URL(targetDomain).host }, // Atualiza o cabeçalho 'host'
      ...requestData, // Inclui o corpo da requisição, se houver
      timeout: 60000, // Timeout configurável (60 segundos aqui)
      validateStatus: () => true, // Permite que todos os códigos de status sejam retornados
    });

    // Transfere os cabeçalhos da resposta do destino para o cliente
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Retorna o status e o corpo da resposta para o cliente
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Erro no proxy:", error.message);
    res.status(500).json({ error: "Erro ao redirecionar a requisição" });
  }
};

export default customProxyMiddleware;
