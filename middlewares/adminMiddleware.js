const adminMiddleware = (req, res, next) => {
  console.log("Usuário autenticado:", req.user);
  if (!req.user || req.user.role !== "admin") {
    console.log(
      "Acesso negado. Apenas administradores podem acessar esta página."
    );
    return res
      .status(403)
      .send("Acesso negado. Apenas administradores podem acessar esta página.");
  }
  next();
};

module.exports = adminMiddleware;
