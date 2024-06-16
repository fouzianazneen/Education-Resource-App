const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  collegeName: { type: String, required: true },
  password: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User'
    }
});





const Student = mongoose.model('Student', studentSchema);

module.exports = Student;