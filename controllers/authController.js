const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("../services/UserService");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Usuário não encontrado.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.senha);
    if (!isPasswordValid) {
      return res.status(401).send("Senha incorreta.");
    }

    // Gerar o token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, "seu_segredo", {
      expiresIn: "1h", // Token expira em 1 hora
    });

    // Enviar o token como cookie
    res.cookie("authToken", token, { httpOnly: true, maxAge: 3600000 }); // 1 hora
    return res.redirect(user.role === "admin" ? "/" : "/usuario");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor.");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserService.GetByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).send("Credenciais inválidas.");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token, { httpOnly: true });
    res.redirect("/usuario");
  } catch (err) {
    console.error("Erro ao realizar login:", err);
    res.status(500).send("Erro interno no servidor.");
  }
};

module.exports = { login };
