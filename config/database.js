// Configuração de conexão do banco usando variáveis de ambiente
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || '27018';
const DB_NAME = process.env.DB_NAME || 'agendamento';
const DB_USER = process.env.DB_USER || 'clinic_user';
const DB_PASS = process.env.DB_PASS || 'clinic_pass';

// Monta a string de conexão baseada no ambiente
let connectionString;
if (process.env.NODE_ENV === 'production') {
    // No Docker, conecta usando o nome do serviço 'mongodb'
    connectionString = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/${DB_NAME}`;
} else {
    // Desenvolvimento local, conecta na porta personalizada
    connectionString = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

console.log('Tentando conectar ao:', connectionString.replace(DB_PASS, '***'));

module.exports = {
    connectionString,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER
};
