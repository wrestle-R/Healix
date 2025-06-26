const express = require("express");
const router = express.Router();
const DoctorAvailabilityController = require("../controllers/doctorAvailabilityController");
const { verifyToken, requireDoctor } = require("../middleware/auth");

// Get doctor's availability
router.get("/:doctorId", DoctorAvailabilityController.getDoctorAvailability);

// Update weekly schedule (doctor only)
router.put(
  "/:doctorId/schedule",
  verifyToken,
  requireDoctor,
  DoctorAvailabilityController.updateWeeklySchedule
);

// Set unavailable dates (doctor only)
router.post(
  "/:doctorId/unavailable",
  verifyToken,
  requireDoctor,
  DoctorAvailabilityController.setUnavailableDates
);

// Remove unavailable dates (doctor only)
router.delete(
  "/:doctorId/unavailable",
  verifyToken,
  requireDoctor,
  DoctorAvailabilityController.removeUnavailableDates
);

// Get available slots for a specific date
router.get("/:doctorId/slots", DoctorAvailabilityController.getAvailableSlots);

module.exports = router;
