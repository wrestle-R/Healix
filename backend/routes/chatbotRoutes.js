const express = require('express');
const medicalController = require('../controllers/medicalController');

const router = express.Router();

// Health check route
router.get('/', medicalController.healthCheck.bind(medicalController));

// Get medical advice route
router.post('/get-medical-advice', medicalController.getMedicalAdvice.bind(medicalController));

module.exports = router;