const UserService = require("../services/UserService");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// lista todos os usuarios
const listUsers = async (req, res) => {
  try {
    const users = await UserService.GetAll();
    res.render("listUsers.ejs", { users });
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).send("Erro ao carregar a lista de usuários.");
  }
};

// salva um novo usuario (faz verificações antes de salvar)
const salvarUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("cadastro", {
      errors: errors.array(),
      formData: req.body,
    });
  }

  try {
    // Verifica se o e-mail ou celular já estão cadastrados
    const existingUser = await UserService.FindOne({
      $or: [{ email: req.body.email }, { celular: req.body.celular }],
    });

    if (existingUser) {
      return res.status(400).render("cadastro", {
        errors: [{ msg: "E-mail ou celular já cadastrados." }],
        formData: req.body,
      });
    }

    // Processa os dados se não houver duplicidade de email ou celular
    var status = await UserService.Create(
      req.body.nomeCompleto,
      req.body.dataNascimento,
      req.body.celular,
      req.body.email,
      req.body.senha,
      req.body.profissao,
      req.body.endereco,
      req.body.alergiaCosmetico,
      req.body.alergiaMedicamento,
      req.body.usoMedicamento,
      req.body.problemasCardiacos,
      req.body.condicoesMedicas,
      req.body.cirurgiaRecente,
      req.body.condicaoAutoImune,
      req.body.estresse,
      req.body.dietaRestrita,
      req.body.condicoesMedicasTexto,
      req.body.cirurgiaRecenteTexto,
      req.body.condicaoAutoImuneTexto,
      req.body.alergiaCosmeticoTexto,
      req.body.alergiaMedicamentoTexto,
      req.body.usoMedicamentoTexto,
      req.body.problemasCardiacosTexto
    );

    if (status) {
      res.redirect("home");
    } else {
      res.send("Ocorreu uma falha!");
    }
  } catch (err) {
    console.error("Erro ao verificar duplicidade:", err);
    res.status(500).send("Erro ao processar o cadastro.");
  }
};

const renderCadastro = async (req, res) => {
  const user = await UserService.GetById(req.user.id);
  res.render("create", { user });
};

const renderUpdateUser = async (req, res) => {
  try {
    const user = await UserService.GetById(req.params.id);
    res.render("updateUser", { user });
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).send("Erro ao carregar a página de atualização.");
  }
};

const updateUser = async (req, res) => {
  try {
    await UserService.Update(req.body.id, req.body);
    res.redirect("/listaUsuarios");
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).send("Erro ao atualizar os dados do usuário.");
  }
};

const renderUserUpdate = async (req, res) => {
  try {
    const user = await UserService.GetById(req.params.id);
    res.render("userUpdate", { user });
  } catch (err) {
    res.status(500).send("Erro ao carregar a página de edição.");
  }
};

const userUpdate = async (req, res) => {
  try {
    const {
      id,
      nomeCompleto,
      dataNascimento,
      celular,
      email,
      profissao,
      endereco,
      senhaAntiga,
      novaSenha,
    } = req.body;

    const updateData = {
      nomeCompleto,
      dataNascimento,
      celular,
      email,
      profissao,
      endereco,
    };

    // caso o usuário quiser trocar a senha add a nova senha em updateData
    if (senhaAntiga && novaSenha) {
      const user = await UserService.GetById(id);
      const senhaCorreta = await bcrypt.compare(senhaAntiga, user.senha);

      const senhaValida = /^(?=.*[A-Z])(?=.*\d).+$/.test(novaSenha);

      if (!senhaCorreta) {
        return res.status(400).send("Senha atual incorreta!");
      }
      if (!senhaValida) {
        return res
          .status(400)
          .send(
            "A nova senha deve conter pelo menos uma letra maiúscula e um número."
          );
      }

      updateData.senha = await bcrypt.hash(novaSenha, 10);
    }

    await UserService.Update(id, updateData);
    res.redirect("/usuario");
  } catch (err) {
    res.status(500).send("Erro ao atualizar os dados.");
  }
};

const finishUser = async (req, res) => {
  try {
    const id = req.body.id;
    await UserService.Finish(id);
    res.redirect("/listaUsuarios");
  } catch (err) {
    console.error("Erro ao excluir usuário:", err);
    res.status(500).send("Erro ao excluir usuário.");
  }
};

const renderUsuario = async (req, res) => {
  try {
    const user = await UserService.GetById(req.user.id); // Busca o usuário logado pelo ID
    if (!user) {
      return res.status(404).send("Usuário não encontrado.");
    }
    res.render("usuario", { user }); // Passa os dados do usuário para a view
  } catch (err) {
    console.error("Erro ao buscar usuário logado:", err);
    res.status(500).send("Erro ao carregar os dados do usuário.");
  }
};

const addDiarioEntry = async (req, res) => {
  try {
    const { userId, texto } = req.body;
    const novaEntrada = {
      data: new Date(),
      texto: texto,
    };
    await UserService.AddDiarioEntry(userId, novaEntrada);
    res.redirect("/usuario");
  } catch (err) {
    console.error("Erro ao salvar diário:", err);
    res.status(500).send("Erro ao salvar atualização do diário.");
  }
};

const deleteDiarioEntry = async (req, res) => {
  try {
    const { userId, entryIndex } = req.body;
    await UserService.DeleteDiarioEntry(userId, entryIndex);
    res.redirect("/usuario");
  } catch (err) {
    console.error("Erro ao excluir atualização do diário:", err);
    res.status(500).send("Erro ao excluir atualização do diário.");
  }
};

const editDiarioEntry = async (req, res) => {
  try {
    const { userId, entryIndex, texto } = req.body;
    await UserService.EditDiarioEntry(userId, entryIndex, texto);
    res.redirect("/usuario");
  } catch (err) {
    res.status(500).send("Erro ao editar atualização do diário.");
  }
};

const searchUser = async (req, res) => {
  try {
    const users = await UserService.Search(req.query.search);
    res.render("listUsers", { users });
  } catch (error) {
    res.status(500).send("Erro ao buscar usuários");
  }
};

module.exports = {
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
};
