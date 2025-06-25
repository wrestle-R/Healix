const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'doctor'
  },
  specialization: {
    type: String
  },
  phone: {
    type: String
  },
  hospital: {
    type: String
  },
  experience: {
    type: Number
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
