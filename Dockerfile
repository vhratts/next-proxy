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

# Expõe a porta 3000 (padrão do Next.js)
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]
