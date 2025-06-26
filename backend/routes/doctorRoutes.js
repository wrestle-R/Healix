const express = require("express");
const router = express.Router();
const DoctorController = require("../controllers/doctorController");
const { verifyToken, requireDoctor } = require("../middleware/auth");

// Create or update doctor profile
router.put(
  "/profile/:firebaseUid",
  verifyToken,
  DoctorController.createOrUpdateProfile
);

// Get doctor profile by ID
router.get("/:doctorId", DoctorController.getProfile);

// Get doctor by Firebase UID
router.get(
  "/firebase/:firebaseUid",
  verifyToken,
  DoctorController.getProfileByFirebaseUid
);

// Search doctors
router.get("/", DoctorController.searchDoctors);

// Get doctor's detailed profile for booking
router.get("/:doctorId/details", DoctorController.getDoctorDetails);

// Get specializations list
router.get("/data/specializations", DoctorController.getSpecializations);

// Get available cities
router.get("/data/cities", DoctorController.getAvailableCities);

module.exports = router;
