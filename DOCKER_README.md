# Docker Setup - Sistema de Agendamentos

Este documento explica como configurar e executar o sistema completo de agendamentos usando Docker.

## Arquivos Docker

- **`Dockerfile`** - Dockerfile para a aplicação Node.js
- **`Dockerfile.db`** - Dockerfile para criar a imagem do MongoDB
- **`docker-compose.yml`** - Configuração completa (produção): app + banco + mongo-express
- **`docker-compose.dev.yml`** - Configuração de desenvolvimento: só banco + mongo-express
- **`scripts/init-db.js`** - Script de inicialização do banco de dados
- **`scripts/create-admin.js`** - Script para criar usuário administrador
- **`scripts/start.sh`** - Script de inicialização da aplicação
- **`config/database.js`** - Configuração dinâmica de conexão
- **`.env.example`** - Exemplo de variáveis de ambiente
- **`docker-manager.ps1`** - Script PowerShell de gerenciamento

## Pré-requisitos

- Docker instalado
- Docker Compose instalado

## Como executar

### 1. Modo Produção (Recomendado)
*Aplicação completa em containers*

```bash
# Clonar o repositório e navegar até a pasta
git clone https://github.com/leolessi/TCC_Tricologia.git
cd TCC_Tricologia
git checkout teste-docker

# Executar todos os serviços
docker-compose up -d

# Verificar se os containers estão rodando
docker-compose ps
```

**Acessos:**
- **Aplicação:** http://localhost:8080
- **Admin banco:** http://localhost:8081
- **Login:** admin@clinic.com / admin123 (criado automaticamente)

### 2. Modo Desenvolvimento
*Só banco em container, app local*

```bash
# Iniciar apenas o banco
docker-compose -f docker-compose.dev.yml up -d

# Em outro terminal, executar a aplicação localmente
npm install
node index.js
```

**Acessos:**
- **Aplicação:** http://localhost:8080 (local)
- **Admin banco:** http://localhost:8081
- **MongoDB:** localhost:27018

### 3. Comandos Docker úteis
```bash
# Iniciar (produção)
docker-compose up -d

# Iniciar (desenvolvimento)
docker-compose -f docker-compose.dev.yml up -d

# Parar
docker-compose down

# Ver logs em tempo real
docker-compose logs -f

# Ver logs específicos
docker-compose logs -f app
docker-compose logs -f mongodb

# Ver status
docker-compose ps

# Rebuild se mudou código
docker-compose up -d --build

# Reset completo (CUIDADO: apaga dados)
docker-compose down -v
docker-compose up -d --build

# Executar comandos no container
docker-compose exec app bash
docker-compose exec mongodb mongosh agendamento
```

### 4. Script PowerShell (Windows)
```powershell
# Modo produção
.\docker-manager.ps1 prod

# Modo desenvolvimento
.\docker-manager.ps1 dev

# Ver status
.\docker-manager.ps1 status

# Ver logs
.\docker-manager.ps1 logs

# Backup
.\docker-manager.ps1 backup

# Reset
.\docker-manager.ps1 reset

# Ajuda
.\docker-manager.ps1 help
```

## Serviços disponíveis

### **Aplicação Node.js (Produção)**
- **Porta**: 8080
- **URL**: http://localhost:8080
- **Login admin**: admin@clinic.com / admin123
- **Criação**: Automática na inicialização

### **MongoDB**
- **Porta externa**: 27018 (desenvolvimento) / 27017 (produção interna)
- **Usuário admin**: admin
- **Senha admin**: clinic123
- **Banco de dados**: agendamento
- **Usuário da aplicação**: clinic_user
- **Senha da aplicação**: clinic_pass

### **Mongo Express (Interface Web)**
- **URL**: http://localhost:8081
- **Usuário**: admin
- **Senha**: clinic123
- **Função**: Interface gráfica para administrar o MongoDB

## Estrutura do banco de dados

O script de inicialização (`scripts/init-db.js`) cria:

### **Coleções:**
- **`users`** - Usuários do sistema (pacientes e administradores)
- **`appointments`** - Agendamentos e consultas

### **Índices para performance:**
- `users.email` (único)
- `users.role`
- `appointments.email`
- `appointments.date`
- `appointments.finished`

### **Usuário padrão (criado automaticamente):**
- **Email**: admin@clinic.com
- **Senha**: admin123
- **Role**: admin
- **Criação**: Automática via `scripts/create-admin.js`

## Configuração da aplicação

### **Conexão dinâmica:**
A aplicação usa `config/database.js` para conectar automaticamente:

- **Produção (Docker)**: `mongodb://clinic_user:clinic_pass@mongodb:27017/agendamento`
- **Desenvolvimento**: `mongodb://clinic_user:clinic_pass@127.0.0.1:27018/agendamento`

### **Variáveis de ambiente:**
```bash
NODE_ENV=production          # Ambiente (production/development)
DB_HOST=mongodb             # Host do banco
DB_PORT=27017               # Porta do banco
DB_NAME=agendamento         # Nome do banco
DB_USER=clinic_user     # Usuário da aplicação
DB_PASS=clinic_pass     # Senha da aplicação
```

## Backup e Restore

### **Backup automático:**
```bash
# Usando script PowerShell (cria pasta com timestamp)
.\docker-manager.ps1 backup

# Manual
docker-compose exec mongodb mongodump --db agendamento --out /backup
```

### **Restaurar backup:**
```bash
# Copiar backup para container
docker cp ./backup/agendamento clinic_mongodb:/backup/

# Restaurar
docker-compose exec mongodb mongorestore --db agendamento /backup/agendamento
```

## Correções e Melhorias

### **✅ Problema de fuso horário corrigido**
- **Antes**: Agendamentos apareciam com +1 dia e -3 horas
- **Depois**: Data e hora corretas
- **Arquivo**: `factories/AppointmentFactory.js`

### **✅ Inicialização automática**
- **Admin criado automaticamente** na inicialização
- **Health checks** garantem ordem correta de inicialização
- **Configuração dinâmica** de ambiente

### **✅ Portabilidade completa**
- **Container da aplicação** + banco de dados
- **Funciona em qualquer máquina** com Docker
- **Sem dependências externas** de Node.js

## Comandos úteis avançados

### **Monitoramento:**
```bash
# Status detalhado
docker-compose ps --format table

# Uso de recursos
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Logs com filtro
docker-compose logs --since 1h app
docker-compose logs --tail=100 mongodb
```

### **Manutenção:**
```bash
# Limpar imagens não utilizadas
docker image prune -f

# Limpar tudo (CUIDADO!)
docker system prune -a

# Ver espaço usado
docker system df

# Executar comandos específicos
docker-compose exec app npm --version
docker-compose exec mongodb mongosh --version
```

## Troubleshooting

### **Container da aplicação reiniciando:**
```bash
# Ver logs detalhados
docker-compose logs app

# Verificar arquivos no container
docker-compose exec app ls -la

# Rebuild forçado
docker-compose build --no-cache app
docker-compose up -d
```

### **Container não inicia:**
```bash
# Verificar logs
docker-compose logs mongodb

# Verificar se a porta está em uso
netstat -ano | findstr :27017
netstat -ano | findstr :8080

# Matar processo na porta (Windows)
taskkill /PID [número_do_pid] /F
```

### **Problemas de conexão:**
- Verificar se o firewall está bloqueando as portas
- Certificar-se de que o Docker Desktop está rodando
- Verificar se não há outro MongoDB/aplicação na mesma porta

### **Problemas de permissão (Windows):**
```powershell
# Executar PowerShell como administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Data/hora incorreta nos agendamentos:**
- **Problema resolvido** na versão atual
- Se ainda ocorrer, verificar `factories/AppointmentFactory.js`
- Não deve ter `+1` no dia nem `-3` nas horas

### **Admin não consegue fazer login:**
- Usuário é criado automaticamente
- Se não funcionar: `docker-compose exec app node scripts/create-admin.js`
- Login: `admin@clinic.com` / `admin123`

### **Reset completo:**
```bash
# Parar tudo e limpar
docker-compose down -v
docker system prune -f

# Reconstruir e executar
docker-compose up --build -d

# Ou usando script
.\docker-manager.ps1 reset
.\docker-manager.ps1 prod
```

## FAQ

**P: Como usar em outro computador?**
R: Clone o repositório, execute `docker-compose up -d`. Só precisa do Docker instalado.

**P: Como atualizar o código?**
R: `git pull`, depois `docker-compose up -d --build`

**P: Como fazer backup?**
R: Use `.\docker-manager.ps1 backup` ou comandos manuais mostrados acima.

**P: Posso usar sem o script PowerShell?**
R: Sim! Use os comandos `docker-compose` diretamente.

**P: Como desenvolver alterações no código?**
R: Use modo desenvolvimento com `docker-compose.dev.yml` e rode `node index.js` local.
