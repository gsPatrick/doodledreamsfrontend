# ---- Estágio 1: Build ----
# Usamos uma imagem Node para ter acesso ao npm
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala todas as dependências (incluindo as de desenvolvimento)
RUN npm install

# Copia o resto do código-fonte do projeto
COPY . .

# Executa o script de build que gera a pasta /dist
RUN npm run build

# ---- Estágio 2: Serve ----
# Usamos uma imagem Nginx, que é leve e otimizada para servir arquivos
FROM nginx:alpine

# Copia os arquivos da pasta /dist gerados no estágio de build
# para a pasta padrão do Nginx que serve conteúdo web
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Adiciona nossa própria configuração do Nginx (veja o passo 2)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80, que o Nginx usa por padrão
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]