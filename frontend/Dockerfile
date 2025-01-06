# Utiliza a imagem oficial do Node.js como base
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia o restante do código-fonte
COPY . .

# Exposição da porta 3000
EXPOSE 3000

# Comando para executar a aplicação
CMD [ "npm", "run", "start" ]
