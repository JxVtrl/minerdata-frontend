# Imagem base com Node
FROM node:18

# Cria pasta de trabalho
WORKDIR /app

# Copia dependências
COPY package*.json ./
RUN npm install

# Copia código-fonte
COPY . .

# Exponha a porta padrão do Vite
EXPOSE 5173

# Inicia o servidor de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host"]
