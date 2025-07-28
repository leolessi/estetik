# Dockerfile para a aplicação Node.js - Sistema de Agendamentos
FROM node:18-alpine

# Instala netcat para verificar conectividade
RUN apk add --no-cache netcat-openbsd

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código da aplicação
COPY . .

# Torna o script de inicialização executável
RUN chmod +x scripts/start.sh

# Expõe a porta da aplicação
EXPOSE 8080

# Define variáveis de ambiente padrão
ENV NODE_ENV=production
ENV DB_HOST=mongodb
ENV DB_PORT=27017
ENV DB_NAME=agendamento
ENV DB_USER=clinic_user
ENV DB_PASS=clinic_pass

# Comando para iniciar a aplicação
CMD ["sh", "-c", "echo 'Aguardando MongoDB...' && sleep 10 && node scripts/create-admin.js; node index.js"]
