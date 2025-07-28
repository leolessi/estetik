const bcrypt = require("bcrypt");

async function generateHash() {
    const plainPassword = "admin123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log("Senha original:", plainPassword);
    console.log("Hash gerado:", hashedPassword);
}

generateHash();
