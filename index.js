const express = require("express"); // importa o módulo express (framework web para node)
const bodyParser = require("body-parser"); // middleware que processa o corpo das requisições HTTP (transforma os dados enviados, como formulários ou JSON em objetos JS)
const mongoose = require("mongoose"); // importa o mongoose ( gerencia relacionamento entre os dados, fornece validação, etc)
const { connectionString } = require("./config/database"); // configuração do banco
const UserService = require("./services/UserService");
const authMiddleware = require("./middlewares/authMiddleware");
const adminMiddleware = require("./middlewares/adminMiddleware");
const authController = require("./controllers/authController");
const cookieParser = require("cookie-parser"); // middleware para processar os cookies
const { body } = require("express-validator"); // middleware para validação dos dados em app.post("/salvar")

// importa as funções do appointmentController
const {
  createAppointment,
  getCalendar,
  getEventById,
  renderUpdate,
  listAppointments,
  searchAppointments,
  updateAppointment,
  finishAppointment,
} = require("./controllers/appointmentController");

// importa as funço~es do userController
const {
  listUsers,
  salvarUsuario,
  renderCadastro,
  renderUpdateUser,
  updateUser,
  searchUser,
  renderUserUpdate,
  userUpdate,
  finishUser,
  renderUsuario,
  addDiarioEntry,
  editDiarioEntry,
  deleteDiarioEntry,
} = require("./controllers/userController");

const app = express(); // cria uma instância do express

app.use(express.static("public")); // especifíca onde os arquivos estáticos são fornecidos
app.use(bodyParser.urlencoded({ extended: true })); // interpreta os dados de forms
app.use(bodyParser.json()); // interpreta os dados em JSON
app.use(cookieParser()); // lida com cookies nas requisições

// define a visualização para ejs
app.set("view engine", "ejs");

// inicia o servidor na porta 8080
app.listen(8080, () => {
  console.log("Server running at port 8080");
});

// conexao com o bd agendamento (MongoDB)
mongoose
  .connect(connectionString, {})
  .then(() => {
    console.log("Conectado ao MongoDB");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB", err);
  });

// renderiza pag principal do admin (autenticação e permissão de adm)
app.get("/", authMiddleware, adminMiddleware, (req, res) => {
  res.render("index.ejs");
});

// renderiza pag home (verifica se o usuário está logado pelo cookie)
app.get("/home", (req, res) => {
  // verifica se o token de autenticação existe
  const isLoggedIn = !!req.cookies.authToken;
  res.render("home.ejs", { isLoggedIn });
});

// renderiza a pag de login
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// rota para efetuar logout (limpa os cookies de autenticação e redireciona para home)
app.get("/logout", (req, res) => {
  // limpa os cookies de autenticação
  res.clearCookie("authToken");
  res.redirect("/home");
});

// renderiza a pag de cadastro de usuario/ficha de anamnese
app.get("/cadastroAnamnese", (req, res) => {
  res.render("cadastro.ejs", { errors: null, formData: {} });
});

// renderiza a pag de agendamento (apenas admin)
app.get("/cadastro", authMiddleware, adminMiddleware, renderCadastro);

// lista todos os usuarios (apenas admin)
app.get("/listaUsuarios", authMiddleware, adminMiddleware, listUsers);

// Cria um novo agendamento (apenas admin)
app.post("/create", createAppointment, adminMiddleware);

// rota para cadastrar um novo usuario (autenticação por express-validator)
app.post(
  "/salvar",
  [
    body("nomeCompleto")
      .notEmpty()
      .withMessage("O nome completo é obrigatório."),
    body("dataNascimento").isDate().withMessage("Data de nascimento inválida."),
    body("celular")
      .trim()
      .isMobilePhone("pt-BR")
      .withMessage("Número de celular inválido."),
    body("email").isEmail().withMessage("E-mail inválido."),
    body("senha")
      .isLength({ min: 8 })
      .withMessage("A senha deve ter pelo menos 8 caracteres.")
      .matches(/^(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "A senha deve conter pelo menos uma letra maiúscula [A-Z] e um número [0-9]."
      ),
    body("profissao").notEmpty().withMessage("A profissão é obrigatória."),
    body("endereco").notEmpty().withMessage("O endereço é obrigatório."),
  ],
  salvarUsuario
);

// renderiza pag de calendario com os agendamentos (apenas admin)
app.get("/getcalendar", getCalendar, adminMiddleware);

// rota para renderizar uma unica consulta (apenas admin)
app.get("/event/:id", authMiddleware, adminMiddleware, getEventById);

// finaliza/exclui uma consulta (apenas admin)
app.post("/finish", finishAppointment, adminMiddleware);

// lista todos os horários agendados (apenas admin)
app.get("/list", authMiddleware, adminMiddleware, listAppointments);

// busca uma consulta pelo parametro (apenas admin)
app.get("/searchresult", searchAppointments, adminMiddleware);

// Rota para renderizar a página de edição do agendamento (apenas admin)
app.get("/update/:id", renderUpdate, adminMiddleware);

// atualiza o agendamento com o método POST pois o html não suporta o método PUT (apenas admin)
app.post("/update", updateAppointment, adminMiddleware);

// Rota para exibir a página de atualização de usuário (com permissoes de adm)
app.get("/updateUser/:id", authMiddleware, adminMiddleware, renderUpdateUser);

// atuliza um usuário com o método POST - html naõ tem suporte nativo para PUT (apenas admin)
app.post("/updateUser", updateUser, adminMiddleware);

// rota para renderizar a página userUpdate (página do usuário, não do admin)
app.get("/userUpdate/:id", authMiddleware, renderUserUpdate);

// rota para atualizar apenas os campos pessoais e senha (de responsabilidade do usuário)
app.post("/userUpdate", authMiddleware, userUpdate);

// retorna usuarios buscados por um parametro (nome, e-mail ou celular)
app.get("/searchUser", searchUser);

// exlcui um usuario cadastrado
app.post("/finishUser", finishUser);

// realiza login (autenticação)
app.post("/login", authController.login);

// renderiza a seção Meu Espaço do usuário
app.get("/usuario", authMiddleware, renderUsuario);

// realiza uma nova entrada no diário
app.post("/usuario/diario", authMiddleware, addDiarioEntry);

// excluir uma entrada do diário
app.post("/usuario/diario/delete", authMiddleware, deleteDiarioEntry);

// Editar entrada do diário
app.post("/usuario/diario/edit", authMiddleware, editDiarioEntry);
