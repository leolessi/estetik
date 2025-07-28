// Script de inicialização do banco de dados MongoDB para Sistema de Agendamentos

// Seleciona o banco de dados
db = db.getSiblingDB('agendamento');

// Cria usuário específico para a aplicação
db.createUser({
    user: 'clinic_user',
    pwd: 'clinic_pass',
    roles: [
        {
            role: 'readWrite',
            db: 'agendamento'
        }
    ]
});

// Cria coleções com validação de schema
db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['nomeCompleto', 'email', 'senha'],
            properties: {
                nomeCompleto: {
                    bsonType: 'string',
                    description: 'Nome completo é obrigatório'
                },
                email: {
                    bsonType: 'string',
                    pattern: '^.+@.+\..+$',
                    description: 'Email deve ser válido'
                },
                senha: {
                    bsonType: 'string',
                    description: 'Senha é obrigatória'
                },
                role: {
                    bsonType: 'string',
                    enum: ['admin', 'user'],
                    description: 'Role deve ser admin ou user'
                }
            }
        }
    }
});

db.createCollection('appointments', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'email', 'date', 'time'],
            properties: {
                name: {
                    bsonType: 'string',
                    description: 'Nome é obrigatório'
                },
                email: {
                    bsonType: 'string',
                    pattern: '^.+@.+\..+$',
                    description: 'Email deve ser válido'
                },
                date: {
                    bsonType: 'date',
                    description: 'Data é obrigatória'
                },
                time: {
                    bsonType: 'string',
                    description: 'Horário é obrigatório'
                }
            }
        }
    }
});

// Cria índices para melhor performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.appointments.createIndex({ "email": 1 });
db.appointments.createIndex({ "date": 1 });
db.appointments.createIndex({ "finished": 1 });

// Insere usuário admin padrão (senha será criada via aplicação)
// Para criar o admin, acesse a aplicação e registre um usuário com email admin@clinic.com
// Depois conecte no banco e altere o role para "admin"

print('Banco de dados inicializado com sucesso!');
