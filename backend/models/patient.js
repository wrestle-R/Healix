const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
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
    default: 'patient'
  },
  dateOfBirth: {
    type: Date
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  medicalHistory: [{
    condition: String,
    date: Date,
    notes: String
  }],

}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);
