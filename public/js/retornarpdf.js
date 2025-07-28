document.getElementById("gerarPDF").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Captura os dados do formulário
  const formData = new FormData(document.querySelector("form"));
  let yPosition = 20; // Posição inicial no eixo Y

  // Título do PDF
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Formulário de Anamnese", 10, yPosition);
  yPosition += 10;

  // Mapeamento de rótulos personalizados
  const fieldLabels = {
    nomeCompleto: "Nome completo",
    dataNascimento: "Data de Nascimento",
    celular: "Celular",
    email: "E-mail",
    profissao: "Profissão",
    endereco: "Endereço",
    condicoesMedicas: "Condições Médicas",
    cirurgiaRecente: "Cirurgia Recente",
    condicaoAutoImune: "Condição Auto Imune",
    alergiaCosmetico: "Alergia a Cosméticos",
    alergiaMedicamento: "Alergia a Medicamentos",
    usoMedicamento: "Uso de Medicamentos",
    problemasCardiacos: "Problemas cardíacos",
    estresse: "Costuma se estressar muito durante o dia?",
    dietaRestrita: "Dieta com restrições alimentares",
  };

  // Captura os campos de texto condicionais manualmente
  const conditionalFields = [
    {
      id: "cirurgiaRecenteTexto",
      label: "Passou por alguma cirurgia recente",
    },
    {
      id: "condicaoAutoImuneTexto",
      label: "Possui alguma condição auto imune",
    },
    {
      id: "alergiaCosmeticoTexto",
      label: "Tem alergia a algum cosmético",
    },
    {
      id: "alergiaMedicamentoTexto",
      label: "Tem alergia a algum medicamento",
    },
    {
      id: "usoMedicamentoTexto",
      label: "Faz uso de algum medicamento? Qual frequência?",
    },
  ];

  // Adiciona os dados do formulário ao PDF
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  for (const [key, value] of formData.entries()) {
    // Usa o rótulo personalizado, se existir
    const label = fieldLabels[key] || key;

    // Adiciona o rótulo e o valor diretamente ao PDF
    doc.text(`${label}: ${value}`, 10, yPosition);
    yPosition += 8; // Incrementa a posição Y para a próxima linha

    // Verifica se a posição Y ultrapassou o limite da página
    if (yPosition > 280) {
      doc.addPage(); // Adiciona uma nova página
      yPosition = 20; // Reseta a posição Y
    }
  }

  // Salva o PDF
  doc.save("formulario_respostas.pdf");
});

document.getElementById("imprimirPDF").addEventListener("click", function () {
  window.print(); // Abre a interface de impressão do navegador
});
