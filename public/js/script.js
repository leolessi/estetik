// Funções para mostrar e esconder campos de acordo com a resposta do usuário
// e para resetar o formulário ao recarregar a página

document.addEventListener("DOMContentLoaded", function () {
  function toggleConditionalInput(radioGroupName, conditionalInputId) {
    const radioGroup = document.getElementsByName(radioGroupName);
    const conditionalInput = document.getElementById(conditionalInputId);

    if (!radioGroup || !conditionalInput) return; // Verifica se os elementos existem

    for (let i = 0; i < radioGroup.length; i++) {
      radioGroup[i].addEventListener("change", function () {
        if (this.value === "sim" || this.value === "outro") {
          conditionalInput.style.display = "block";
        } else {
          conditionalInput.style.display = "none";
          conditionalInput.value = ""; // Limpa o campo ao escondê-lo
        }
      });

      // Exibe ou esconde o campo com base no valor inicial
      if (
        radioGroup[i].checked &&
        (radioGroup[i].value === "sim" || radioGroup[i].value === "outro")
      ) {
        conditionalInput.style.display = "block";
      } else {
        conditionalInput.style.display = "none";
      }
    }
  }

  // Resetar o formulário ao recarregar a página
  const form = document.querySelector("form");
  if (form) {
    form.reset();
  }

  // Configurar os campos condicionais
  toggleConditionalInput("alergiaCosmetico", "alergiaCosmeticoTexto");
  toggleConditionalInput("alergiaMedicamento", "alergiaMedicamentoTexto");
  toggleConditionalInput("usoMedicamento", "usoMedicamentoTexto");
  toggleConditionalInput("condicoesMedicas", "condicoesMedicasTexto");
  toggleConditionalInput("problemasCardiacos", "problemasCardiacosTexto");
  toggleConditionalInput("cirurgiaRecente", "cirurgiaRecenteTexto");
  toggleConditionalInput("condicaoAutoImune", "condicaoAutoImuneTexto");
});
