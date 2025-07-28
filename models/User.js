const mongoose = require("mongoose");

const usuario = new mongoose.Schema({
  nomeCompleto: String,
  celular: String,
  email: String,
  senha: String,
  profissao: String,
  dataNascimento: Date,
  time: String,
  endereco: String,
  alergiaCosmetico: String,
  alergiaMedicamento: String,
  usoMedicamento: String,
  problemasCardiacos: String,
  condicoesMedicas: String,
  cirurgiaRecente: String,
  condicaoAutoImune: String,
  estresse: String,
  dietaRestrita: String,
  condicoesMedicasTexto: String,
  cirurgiaRecenteTexto: String,
  condicaoAutoImuneTexto: String,
  alergiaCosmeticoTexto: String,
  alergiaMedicamentoTexto: String,
  usoMedicamentoTexto: String,
  problemasCardiacosTexto: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  diarioTratamento: [
    {
      data: { type: Date, default: Date.now },
      texto: String,
    },
  ],
});

module.exports = mongoose.model("User", usuario);
