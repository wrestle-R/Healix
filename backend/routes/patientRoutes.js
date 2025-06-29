const express = require("express");
const router = express.Router();
const PatientController = require("../controllers/patientController");
const { verifyToken, requireDoctor } = require("../middleware/auth");

// Create or update patient profile
router.put(
  "/profile/:firebaseUid",
  verifyToken,
  PatientController.createOrUpdateProfile
);
router.get('/analytics', verifyToken, PatientController.getPatientAnalytics);

// Get patient profile by ID
router.get("/:patientId", verifyToken, PatientController.getProfile);

// Get patient profile by Firebase UID
router.get(
  "/firebase/:firebaseUid",
  verifyToken,
  PatientController.getProfileByFirebaseUid
);

// Get patients for a specific doctor
router.get(
  "/doctor/:doctorId",
  verifyToken,
  requireDoctor,
  PatientController.getDoctorPatients
);

module.exports = router;
