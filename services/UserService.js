const User = require("../models/User");
const bcrypt = require("bcrypt");

class UserService {
  // verifica se ja existe um cadastro igual no banco
  async FindOne(query) {
    return await User.findOne(query);
  }

  async Create(
    nomeCompleto,
    dataNascimento,
    celular,
    email,
    senha,
    profissao,
    endereco,
    alergiaCosmetico,
    alergiaMedicamento,
    usoMedicamento,
    problemasCardiacos,
    condicoesMedicas,
    cirurgiaRecente,
    condicaoAutoImune,
    estresse,
    dietaRestrita,
    condicoesMedicasTexto,
    cirurgiaRecenteTexto,
    condicaoAutoImuneTexto,
    alergiaCosmeticoTexto,
    alergiaMedicamentoTexto,
    usoMedicamentoTexto,
    problemasCardiacosTexto,
    role = "user"
  ) {
    try {
      // Criptografa a senha antes de salvar
      const hashedPassword = await bcrypt.hash(senha, 10);

      var newUser = new User({
        nomeCompleto,
        dataNascimento,
        celular,
        email,
        senha: hashedPassword, // Salva a senha criptografada
        profissao,
        endereco,
        alergiaCosmetico,
        alergiaMedicamento,
        usoMedicamento,
        problemasCardiacos,
        condicoesMedicas,
        cirurgiaRecente,
        condicaoAutoImune,
        estresse,
        dietaRestrita,
        condicoesMedicasTexto,
        cirurgiaRecenteTexto,
        condicaoAutoImuneTexto,
        alergiaCosmeticoTexto,
        alergiaMedicamentoTexto,
        usoMedicamentoTexto,
        problemasCardiacosTexto,
        role,
      });

      await newUser.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // Busca os usuarios cadastrados no banco
  async GetAll(filter = {}) {
    try {
      // filtrar user.role: 'user'
      const users = await User.find(filter);
      return users;
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      throw err;
    }
  }

  // Busca um usuário pelo ID
  async GetById(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      throw err;
    }
  }

  // Atualiza os dados de um usuário
  async Update(id, updatedData) {
    try {
      await User.findByIdAndUpdate(id, updatedData);
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      throw err;
    }
  }

  async Search(query) {
    try {
      var user = await User.find().or([
        { nomeCompleto: { $regex: `^${query}`, $options: "i" } },
        { email: query },
        { celular: query },
      ]);
      console.log(user);
      return user;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  // Deleta um usuario do banco
  async Finish(id, updatedData) {
    try {
      await User.findByIdAndDelete(id, updatedData);
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      throw err;
    }
  }

  async AddDiarioEntry(userId, entry) {
    try {
      await User.findByIdAndUpdate(userId, {
        $push: { diarioTratamento: entry },
      });
    } catch (err) {
      console.error("Erro ao adicionar entrada no diário:", err);
      throw err;
    }
  }

  async DeleteDiarioEntry(userId, entryIndex) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.diarioTratamento) return;
      user.diarioTratamento.splice(entryIndex, 1);
      await user.save();
    } catch (err) {
      console.error("Erro ao excluir entrada do diário:", err);
      throw err;
    }
  }

  async EditDiarioEntry(userId, entryIndex, novoTexto) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.diarioTratamento || !user.diarioTratamento[entryIndex])
        return;
      user.diarioTratamento[entryIndex].texto = novoTexto;
      await user.save();
    } catch (err) {
      console.error("Erro ao editar entrada do diário:", err);
      throw err;
    }
  }
}

module.exports = new UserService();
