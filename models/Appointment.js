const mongoose = require("mongoose");

const appointment = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  cpf: String,
  phone: String,
  date: Date,
  time: String,
  finished: Boolean,
  serviceType: String,
  createdBy: String,
});

module.exports = appointment;
