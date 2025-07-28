const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { connectionString } = require("../config/database");

async function createAdmin() {
    try {
        // Conecta ao banco
        await mongoose.connect(connectionString, {});
        console.log("Conectado ao MongoDB");

        // Verifica se já existe um admin
        const existingAdmin = await User.findOne({ email: "admin@clinic.com" });
        if (existingAdmin) {
            console.log("✅ Usuário admin já existe!");
            console.log("📧 Email: admin@clinic.com");
            console.log("🔑 Senha: admin123");
            return;
        }

        // Gera hash da senha
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // Cria o usuário admin
        const admin = new User({
            nomeCompleto: "Administrador do Sistema",
            email: "admin@clinic.com",
            senha: hashedPassword,
            role: "admin",
            celular: "",
            profissao: "Administrador",
            dataNascimento: new Date(),
            endereco: "",
            tratamentoCapilar: "",
            frequenciaLavar: "",
            quedaCapilar: "",
            origemHereditaria: "",
            tipoCabelo: "",
            condicaoCabelo: "",
            tipoOleosidade: "",
            alergiaCosmetico: "",
            rotinaCabelos: "",
            alergiaMedicamento: "",
            usoMedicamento: "",
            problemasCardiacos: "",
            condicoesMedicas: "",
            cirurgiaRecente: "",
            condicaoAutoImune: "",
            estresse: "",
            dietaRestrita: "",
            tratamentoCapilarTexto: "",
            frequenciaLavarTexto: "",
            quedaCapilarTexto: "",
            condicoesMedicasTexto: "",
            cirurgiaRecenteTexto: "",
            condicaoAutoImuneTexto: "",
            alergiaCosmeticoTexto: "",
            alergiaMedicamentoTexto: "",
            usoMedicamentoTexto: "",
            problemasCardiacosTexto: "",
            diarioTratamento: []
        });

        await admin.save();
        console.log("✅ Usuário admin criado com sucesso!");
        console.log("📧 Email: admin@clinic.com");
        console.log("🔑 Senha: admin123");

    } catch (error) {
        console.error("❌ Erro ao criar admin:", error.message);
    } finally {
        mongoose.connection.close();
    }
}

createAdmin();
