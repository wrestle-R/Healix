const express = require("express");
const router = express.Router();
const PatientController = require("../controllers/patientController");
const {
  verifyToken,
  requirePatient,
  requireDoctor,
} = require("../middleware/auth");

// Create or update patient profile
router.put(
  "/profile/:firebaseUid",
  verifyToken,
  PatientController.createOrUpdateProfile
);

// Get patient profile by ID
router.get("/:patientId", verifyToken, PatientController.getProfile);

// Get patient profile by Firebase UID
router.get(
  "/firebase/:firebaseUid",
  verifyToken,
  PatientController.getProfileByFirebaseUid
);

// Update medical history
router.put(
  "/:patientId/medical-history",
  verifyToken,
  requirePatient,
  PatientController.updateMedicalHistory
);

// Add emergency contact
router.post(
  "/:patientId/emergency-contact",
  verifyToken,
  requirePatient,
  PatientController.addEmergencyContact
);

// Update allergies
router.put(
  "/:patientId/allergies",
  verifyToken,
  requirePatient,
  PatientController.updateAllergies
);

// Update current medications
router.put(
  "/:patientId/medications",
  verifyToken,
  requirePatient,
  PatientController.updateCurrentMedications
);

// Get all patients (for admin/search)
router.get("/", verifyToken, PatientController.getAllPatients);

// Get patients for a specific doctor
router.get(
  "/doctor/:doctorId",
  verifyToken,
  requireDoctor,
  PatientController.getDoctorPatients
);

module.exports = router;
