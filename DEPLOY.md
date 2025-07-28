# Deploy do Sistema de Agendamentos

## Para usar em outro computador

### **Opção 1: Container Completo (Recomendado)**
*Precisa apenas do vscode e do docker instalado*
*Não precisa instalar Node.js no computador*

#### Pré-requisitos:
- Docker
- Docker Compose

#### Passos:
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/leolessi/TCC_Tricologia.git
   cd TCC_Tricologia
   git checkout teste-docker
   ```

2. **Execute em modo produção:**
   ```bash
   # Opção A: Comando direto
   docker-compose up -d
   
   # Opção B: Script PowerShell (interface mais amigável)
   .\docker-manager.ps1 prod
   ```

3. **Acesse a aplicação:**
   - Site: `http://localhost:8080`
      - **Login:** `admin@clinic.com` / `admin123`
   - Admin banco: `http://localhost:8081`
      - **Login:** `admin` / `clinic123`

> **📝 Nota:** O usuário admin é criado automaticamente na inicialização!

---

### **Opção 2: Desenvolvimento Local**
*Precisa do Node.js instalado*

#### Pré-requisitos:
- Node.js 16+
- Docker
- Docker Compose

#### Passos:
1. **Clone e configure:**
   ```bash
   git clone https://github.com/leolessi/TCC_Tricologia.git
   cd TCC_Tricologia
   git checkout teste-docker
   npm install
   ```

2. **Inicie só o banco:**
   ```bash
   # Opção A: Comando direto
   docker-compose -f docker-compose.dev.yml up -d
   
   # Opção B: Script PowerShell
   .\docker-manager.ps1 dev
   ```

3. **Execute a aplicação:**
   ```bash
   node index.js
   ```

4. **Crie o usuário admin (se necessário):**
   ```bash
   node scripts/create-admin.js
   ```

---

## Comandos Úteis

### **Usando comandos Docker diretos:**
```bash
# Iniciar (produção completa)
docker-compose up -d

# Iniciar (desenvolvimento - só banco)
docker-compose -f docker-compose.dev.yml up -d

# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f app
docker-compose logs -f mongodb

# Parar tudo
docker-compose down

# Reset completo (CUIDADO: apaga dados)
docker-compose down -v
docker-compose up -d --build

# Backup do banco
docker-compose exec mongodb mongodump --db agendamento --out /backup
```

### **Usando o script PowerShell:**
```powershell
# Ver status
.\docker-manager.ps1 status

# Ver logs
.\docker-manager.ps1 logs

# Fazer backup
.\docker-manager.ps1 backup

# Parar tudo
.\docker-manager.ps1 stop

# Reset completo
.\docker-manager.ps1 reset

# Ajuda
.\docker-manager.ps1 help
```

## Correções Implementadas

### **✅ Problema de fuso horário resolvido**
- **Antes:** Agendamentos apareciam com data/hora incorretas (+1 dia, -3 horas)
- **Depois:** Data e hora aparecem exatamente como agendadas
- **Arquivo corrigido:** `factories/AppointmentFactory.js`

### **✅ Criação automática do usuário admin**
- **Antes:** Precisava executar script manualmente
- **Depois:** Admin criado automaticamente na inicialização
- **Login:** `admin@clinic.com` / `admin123`

### **✅ Configuração dinâmica de ambiente**
- **Produção:** Conecta usando nome do serviço Docker
- **Desenvolvimento:** Conecta na porta local customizada
- **Arquivo:** `config/database.js`

## Arquivos Docker Criados

- **`Dockerfile`** - Container da aplicação Node.js
- **`Dockerfile.db`** - Container MongoDB customizado
- **`docker-compose.yml`** - Produção (app + banco + mongo-express)
- **`docker-compose.dev.yml`** - Desenvolvimento (só banco + mongo-express)
- **`scripts/init-db.js`** - Inicialização automática do banco
- **`scripts/create-admin.js`** - Criação do usuário admin
- **`scripts/start.sh`** - Script de inicialização da aplicação
- **`config/database.js`** - Configuração dinâmica de conexão
- **`docker-manager.ps1`** - Script de gerenciamento PowerShell

## Troubleshooting

### Erro de porta ocupada:
```powershell
# Verificar o que está usando a porta
netstat -ano | findstr :8080
netstat -ano | findstr :27017

# Parar processo pelo PID
taskkill /PID [número_do_pid] /F
```

### Problemas de permissão:
```powershell
# Executar PowerShell como administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Container não conecta:
```bash
# Reset completo
docker-compose down -v
docker-compose up -d --build

# Ou usando o script
.\docker-manager.ps1 reset
.\docker-manager.ps1 prod
```

### Aplicação reiniciando constantemente:
```bash
# Ver logs detalhados
docker-compose logs app

# Verificar se todos arquivos foram copiados
docker-compose exec app ls -la

# Rebuild forçado
docker-compose build --no-cache app
docker-compose up -d
```

### Data/hora incorreta nos agendamentos:
- **Problema resolvido** na versão atual
- Se ainda ocorrer, verifique o arquivo `factories/AppointmentFactory.js`
- Não deve ter `+1` no dia nem `-3` nas horas

### Admin não consegue fazer login:
- O usuário é criado automaticamente
- Se não funcionar, recrie: `docker-compose exec app node scripts/create-admin.js`
- Login: `admin@clinic.com` / `admin123`

## Diferenças entre os modos:

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| Node.js | Necessário | Não necessário |
| Containers | Só banco | App + Banco |
| Porta MongoDB | 27018 | 27017 (interno) |
| Porta App | 8080 (local) | 8080 (container) |
| Atualizações | Hot reload | Rebuild container |
| Performance | Mais lento | Mais rápido |
| Admin | Criação manual | Criação automática |
| Uso | Desenvolvimento | Deploy/Produção |

## Logs e Monitoramento

### **Ver logs em tempo real:**
```bash
# Todos os serviços
docker-compose logs -f

# Apenas aplicação
docker-compose logs -f app

# Apenas banco
docker-compose logs -f mongodb

# Últimas 50 linhas
docker-compose logs --tail=50 app
```

### **Monitorar recursos:**
```bash
# Status dos containers
docker-compose ps

# Uso de recursos
docker stats

# Espaço usado
docker system df
```

## Backup e Restore

### **Fazer backup:**
```bash
# Manual
docker-compose exec mongodb mongodump --db agendamento --out /backup

# Usando script (cria pasta com timestamp)
.\docker-manager.ps1 backup
```

### **Restaurar backup:**
```bash
# Primeiro, copie o backup para o container
docker cp ./backup clinic_mongodb:/backup

# Depois restaure
docker-compose exec mongodb mongorestore --db agendamento /backup/agendamento
```
