const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    console.log("Token ausente. Redirecionando para /login.");
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, "seu_segredo");
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Erro ao verificar o token:", err.message);
    res.redirect("/login");
  }
};

module.exports = authMiddleware;
