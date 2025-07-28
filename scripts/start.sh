#!/bin/bash

# Script de inicialização da aplicação
echo "Iniciando aplicação..."

# Aguarda o MongoDB estar disponível
echo "Aguardando MongoDB..."
until nc -z mongodb 27017; do
  echo "MongoDB não está pronto ainda..."
  sleep 2
done
echo "MongoDB está pronto!"

# Aguarda mais um pouco para garantir que o banco está totalmente inicializado
sleep 5

# Executa o script de criação do admin
echo "Criando usuário admin..."
node scripts/create-admin.js

# Inicia a aplicação
echo "Iniciando servidor..."
exec node index.js
