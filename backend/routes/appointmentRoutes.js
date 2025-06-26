const express = require("express");
const router = express.Router();
const AppointmentController = require("../controllers/appointmentController");
const { verifyToken } = require("../middleware/auth");

// Get all appointments for a doctor
router.get(
  "/doctor/:doctorId",
  verifyToken,
  AppointmentController.getDoctorAppointments
);

// Get all appointments for a patient
router.get(
  "/patient/:patientId",
  verifyToken,
  AppointmentController.getPatientAppointments
);

// Get doctor's availability for a specific date range
router.get(
  "/availability/:doctorId",
  AppointmentController.getDoctorAvailability
);

// Book an appointment
router.post("/book", verifyToken, AppointmentController.bookAppointment);

// Update appointment status
router.patch(
  "/:appointmentId/status",
  verifyToken,
  AppointmentController.updateAppointmentStatus
);

// Cancel appointment
router.delete(
  "/:appointmentId",
  verifyToken,
  AppointmentController.cancelAppointment
);

// Get appointment details
router.get(
  "/:appointmentId",
  verifyToken,
  AppointmentController.getAppointmentById
);

// Search doctors by specialty and availability
router.get("/search/doctors", AppointmentController.searchDoctors);

module.exports = router;
