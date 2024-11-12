# Use uma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e o package-lock.json para instalar dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação para o container
COPY . .

# Compila a aplicação Next.js
RUN npm run build

RUN echo "✅ Buld da aplicação executada"
RUN echo "ℹ️ Definindo porta da aplicação"

# Define a variável de ambiente PORT para 2407
ENV PORT=2407
RUN echo "✅ Porta definida com sucesso"
RUN echo "ℹ️ Expondo porta da aplicação"
# Expõe a porta 2407
EXPOSE 2407
RUN echo "✅ Porta da aplicação exposta com sucesso!"

# Comando para rodar a aplicação
CMD ["npm", "start"]
