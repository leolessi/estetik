# Sistema de Agendamentos Clínicos

Este projeto foi desenvolvido como parte de um Trabalho de Conclusão de Curso (TCC) e tem como objetivo criar um sistema de gerenciamento de consultas e usuários voltado para clínicas médicas/estéticas. A aplicação utiliza tecnologias modernas para oferecer uma interface intuitiva e funcionalidades robustas.

### Melhorias em andamento
- Consumo de APIs para preenchimento do endereço e pagamentos online. 
- Loja online.
- Front-end geral.
- Preenchimento de dados automáticos (ao colocar o celular do cliente) na parte de agendar um horário (http://localhost:8080/cadastro)

## Sumário

- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Rotas Principais](#rotas-principais)
- [Arquitetura](#arquitetura)
- [Licença](#licença)
- [Autores](#autores)

## Estrutura do Projeto

```
Clinic_Appointment_System/
├── controllers/
│ ├── appointmentController.js
│ ├── authController.js
│ └── userController.js
├── factories/
│ └── AppointmentFactory.js
├── middlewares/
│ ├── adminMiddleware.js
│ └── authMiddleware.js
├── models/
│ ├── Appointment.js
│ └── User.js
├── public/
│ ├── css/
│ ├── js/
│ └── imagens/
├── services/
│ ├── AppointmentService.js
│ └── UserService.js
├── views/
│ ├── index.ejs
│ ├── login.ejs
│ └── ...
├── index.js
├── package.json
└── README.md
```

## Funcionalidades

- **Autenticação de Usuários**:

  - Login seguro com validação de credenciais.
  - Geração de tokens JWT para autenticação.
  - Middleware para proteger rotas com base em permissões.

- **Gerenciamento de Consultas**:

  - Criação, edição e finalização de consultas.
  - Exibição de consultas em um calendário interativo.
  - Busca de consultas por critérios específicos.

- **Gerenciamento de Usuários**:

  - Cadastro de novos usuários.
  - Atualização de informações de usuários.
  - Listagem de usuários com permissões administrativas.

- **Formulário de Anamnese**:

  - Usuários podem preencher um formulário detalhado de informações clínicas.

- **Interface do Usuário**:
  - Páginas dinâmicas renderizadas com EJS.
  - Integração com arquivos estáticos (CSS, JS) para estilização e interatividade.

## Tecnologias Utilizadas

- **Backend**:

  - Node.js
  - Express
  - MongoDB (Mongoose)

- **Frontend**:

  - EJS (Embedded JavaScript Templates)
  - HTML/CSS/JavaScript

- **Outras Bibliotecas**:
  - FullCalendar
  - `bcrypt` para hashing de senhas.
  - `jsonwebtoken` para autenticação baseada em tokens.
  - `cookie-parser` para manipulação de cookies.

## Configuração do Ambiente

### Opção 1: Docker (Recomendado)

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/seu-usuario/clinic-appointment-system
   cd clinic-appointment-system
   ```

2. **Execute com Docker**:

   ```bash
   docker-compose up -d
   ```

3. **Acesse a aplicação**:
   - Sistema: `http://localhost:8080`
   - Admin DB: `http://localhost:8081`
   - Login: `admin@clinic.com` / `admin123`

### Opção 2: Desenvolvimento Local

1. **Clone o repositório**:

   ```bash
   git clone <url>
   cd pasta_do_projeto
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Configure o banco de dados**:
   Certifique-se de que o MongoDB está instalado e rodando em `mongodb://127.0.0.1:27017/agendamento`.

4. **Inicie o servidor**:

   ```bash
   node index.js
   ```

5. **Acesse a aplicação**:
   Abra o navegador e acesse `http://localhost:8080`.

## Estrutura de Diretórios

- **`controllers/`**: Controladores responsáveis por lidar com as requisições HTTP.
- **`middlewares/`**: Middlewares para autenticação e autorização.
- **`models/`**: Modelos do MongoDB.
- **`public/`**: Arquivos estáticos como CSS, JS e imagens.
- **`services/`**: Lógica de negócios e interação com o banco de dados.
- **`views/`**: Templates EJS para renderização no frontend.

## Arquitetura

A aplicação segue o padrão MVC (Model-View-Controller):

- **Controllers**: Recebem as requisições, processam dados e interagem com os services.
- **Services**: Centralizam a lógica de negócio e o acesso ao banco de dados.
- **Models**: Definem a estrutura dos dados no MongoDB.
- **Views**: Renderizam as páginas dinâmicas usando EJS.
- **Middlewares**: Garantem autenticação e autorização nas rotas protegidas.

## Rotas Principais

### Autenticação

- `POST /login`: Realiza o login do usuário.
- `GET /logout`: Realiza o logout do usuário.

### Usuários

- `GET /listaUsuarios`: Lista todos os usuários (apenas para administradores).
- `POST /updateUser`: Atualiza informações de um usuário.
- `POST /salvar-pdf`: Cadastra um novo usuário (anamnese/cadastro).
- `GET /updateUser/:id`: Exibe o formulário de atualização de usuário.
- `POST /finishUser`: Exclui um usuário.

### Consultas

- `POST /create`: Cria uma nova consulta.
- `GET /getcalendar`: Retorna todas as consultas em formato JSON.
- `POST /update`: Atualiza informações de uma consulta.
- `GET /update/:id`: Exibe o formulário de atualização de consulta.
- `POST /finish`: Finaliza uma consulta.

### Busca

- `GET /searchUser`: Busca usuários pelo nome, email ou celular.
- `GET /searchresult`: Busca consultas por critério.

### Atualização de Dados Pessoais

- `GET /userUpdate/:id`: Exibe o formulário de atualização de dados pessoais do usuário autenticado.
- `POST /userUpdate`: Atualiza dados pessoais e senha do usuário autenticado.

### Visualização de Consulta

- `GET /event/:id`: Exibe detalhes de uma consulta específica (**apenas para administradores**).

### Outras

- `GET /home`: Página inicial.
- `GET /usuario`: Espaço do usuário autenticado.
- `GET /cadastroAnamnese`: Página de cadastro/anamnese para novos usuários.
- `GET /cadastro`: Página de agendamento de consultas (**admin**).
- `GET /list`: Lista de consultas.
- `GET /`: Página principal do calendário (**admin**).

## Deploy com Docker

O projeto inclui configuração completa para Docker:

- **`docker-compose.yml`**: Produção (app + banco + mongo-express)
- **`docker-compose.dev.yml`**: Desenvolvimento (só banco + mongo-express)
- **`docker-manager.ps1`**: Script PowerShell para gerenciamento

### Comandos úteis:

```bash
# Produção
docker-compose up -d

# Desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# Scripts PowerShell (Windows)
.\docker-manager.ps1 prod    # Produção
.\docker-manager.ps1 dev     # Desenvolvimento
.\docker-manager.ps1 backup  # Backup do banco
```

## Observações

- **Permissões**: Algumas rotas são protegidas por autenticação (`authMiddleware`) e/ou exigem perfil de administrador (`adminMiddleware`).
- **Senhas**: O sistema exige senhas com pelo menos 8 caracteres, uma letra maiúscula e um número.
- **Anamnese**: Sistema inclui formulário detalhado para coleta de informações clínicas dos pacientes.

---

**Projeto**: Sistema genérico de agendamentos para clínicas

**Tecnologias**: Node.js, Express, MongoDB, Docker, EJS
