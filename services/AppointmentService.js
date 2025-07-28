const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactory");
const Appo = mongoose.model("Appointment", appointment);

class AppointmentService {
  async Create(
    name,
    email,
    description,
    phone,
    date,
    time,
    serviceType,
    createdBy
  ) {
    var newAppo = new Appo({
      name,
      email,
      description,
      phone,
      date,
      time,
      serviceType,
      createdBy,
      finished: false,
    });
    try {
      await newAppo.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async GetAll(showFinished) {
    if (showFinished) {
      // todas as consultas, independentes de finalizadas ou nao
      return await Appo.find();
    } else {
      // apenas as nao finalizadas
      var appos = await Appo.find({ finished: false });
      var appointments = [];

      appos.forEach((appointment) => {
        if (appointment.date != undefined) {
          appointments.push(AppointmentFactory.Build(appointment));
        }
      });
      return appointments;
    }
  }

  async GetById(id) {
    try {
      var event = await Appo.findOne({ _id: id });
      return event;
    } catch (error) {
      console.log(error);
    }
  }

  async Finish(id) {
    try {
      await Appo.findByIdAndDelete(id, { finished: true });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async Update(id, updatedData) {
    try {
      await Appo.findByIdAndUpdate(id, updatedData, { new: true });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async Search(query) {
    try {
      var appos = await Appo.find().or([
        { email: query },
        { name: { $regex: `^${query}`, $options: "i" } },
      ]);
      console.log(appos);
      return appos;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}

module.exports = new AppointmentService();
