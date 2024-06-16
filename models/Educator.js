const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');

const educatorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  collegeName: { type: String, required: true },
  experience: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Educator",
  },
});

const Educator = mongoose.model("Educator", educatorSchema);

module.exports = Educator;
