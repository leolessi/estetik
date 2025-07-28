const AppointmentService = require("../services/AppointmentService");

// criar um novo agendamento
const createAppointment = async (req, res) => {
  // extrai os dados do corpo da requisiçaõ
  const { name, email, phone, description, date, time, serviceType } = req.body;

  try {
    // chama o service Create para criar o agendamento
    const status = await AppointmentService.Create(
      name,
      email,
      description,
      phone,
      date,
      time,
      serviceType,
      req.body.createdBy
    );
    if (status) {
      res.redirect("/");
    } else {
      res.status(500).send("Erro ao salvar os dados.");
    }
  } catch (err) {
    console.error("Erro ao salvar no banco de dados:", err);
    res.status(500).send("Erro ao salvar os dados.");
  }
};

// retorna os agendamentos no calendário (events)
const getCalendar = async (req, res) => {
  console.log("Acesso autorizado para o calendário");
  try {
    const appointments = await AppointmentService.GetAll(false);
    const events = appointments.map((appo) => ({
      id: appo.id
        ? appo.id.toString()
        : appo._id
        ? appo._id.toString()
        : undefined,
      title: appo.title || appo.name,
      start: appo.start
        ? appo.start instanceof Date
          ? appo.start.toISOString()
          : appo.start
        : appo.date
        ? appo.date instanceof Date
          ? appo.date.toISOString()
          : appo.date
        : undefined,
      end: appo.end
        ? appo.end instanceof Date
          ? appo.end.toISOString()
          : appo.end
        : undefined,
      serviceType:
        appo.serviceType ||
        (appo.title && appo.title.includes("Avaliacao")
          ? "Avaliacao"
          : "Consulta"),
      ...(((appo.serviceType && appo.serviceType === "Avaliacao") ||
        (appo.title && appo.title.includes("Avaliacao"))) && {
        color: "green",
        borderColor: "green",
      }),
    }));
    res.json(events);
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    res.status(500).send("Erro ao buscar agendamentos.");
  }
};

// busca um evento(agendamento) pelo id e renderiza a página daquele evento detalhado
const getEventById = async (req, res) => {
  try {
    const appointment = await AppointmentService.GetById(req.params.id);
    if (!appointment) {
      return res.status(404).send("Consulta não encontrada.");
    }
    res.render("event", { appo: appointment });
  } catch (err) {
    console.error("Erro ao buscar consulta:", err);
    res.status(500).send("Erro ao carregar a consulta.");
  }
};

// lista todos os agendamentos e renderiza a página da lista de agendamentos
const listAppointments = async (req, res) => {
  try {
    const appos = await AppointmentService.GetAll(true);
    res.render("list", { appos });
  } catch (err) {
    console.error("Erro ao listar agendamentos:", err);
    res.status(500).send("Erro ao carregar a lista de agendamentos.");
  }
};

// busca agendamentos com base em um parametro (nome ou e-mail) e renderiza a lista
const searchAppointments = async (req, res) => {
  try {
    const appos = await AppointmentService.Search(req.query.search);
    res.render("list", { appos });
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    res.status(500).send("Erro ao buscar agendamentos.");
  }
};

// exclui um agendamento pelo ID enviado no corpo da requisição
const finishAppointment = async (req, res) => {
  try {
    const id = req.body.id;
    const result = await AppointmentService.Finish(id);
    console.log(result);
    res.redirect("/");
  } catch (err) {
    console.error("Erro ao finalizar consulta:", err);
    res.status(500).send("Erro ao finalizar a consulta.");
  }
};

// Renderiza a página de atualização de um agendamento específico
const renderUpdate = async (req, res) => {
  try {
    const appointment = await AppointmentService.GetById(req.params.id);
    if (!appointment) {
      return res.status(404).send("Consulta não encontrada.");
    }
    res.render("update", { appo: appointment });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar a consulta.");
  }
};

// atualiza os dados de um agendamento específico
const updateAppointment = async (req, res) => {
  try {
    const { id, name, email, description, phone, date, time, serviceType } =
      req.body;

    const updatedData = {
      name,
      email,
      description,
      phone,
      date: new Date(date),
      time,
      serviceType,
    };

    // chama o serviço para atualizar o agendamento
    const success = await AppointmentService.Update(id, updatedData);

    if (success) {
      res.redirect("/");
    } else {
      res.status(500).send("Erro ao atualizar a consulta.");
    }
  } catch (err) {
    console.error("Erro ao atualizar consulta:", err);
    res.status(500).send("Erro ao atualizar a consulta.");
  }
};

// exporta as funções para serem usadas nas rotas
module.exports = {
  createAppointment,
  getCalendar,
  getEventById,
  listAppointments,
  searchAppointments,
  renderUpdate,
  updateAppointment,
  finishAppointment,
};