const bcrypt = require("bcrypt");
const User = require("../models/User");
const mongoose = require("mongoose");

(async () => {
  try {
    // Conecte-se ao banco de dados
    await mongoose.connect("mongodb://127.0.0.1:27017/agendamento", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = "rafaeljamil@email.com"; // Substitua pelo email do usuário
    const plainPassword = "Rafael123"; // Substitua pela senha em texto puro

    // Encontre o usuário no banco de dados
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Usuário não encontrado.");
      return;
    }

    // Criptografe a senha
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Atualize a senha no banco de dados
    user.senha = hashedPassword;
    // atualza o role para admin
    user.role = "admin";
    await user.save();

    console.log("Credenciais atualizadas com sucesso!");
  } catch (err) {
    console.error("Erro ao atualizar credenciais:", err);
  } finally {
    // Feche a conexão com o banco de dados
    mongoose.connection.close();
  }
})();
