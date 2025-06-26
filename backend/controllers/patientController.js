const Patient = require("../models/patient");

class PatientController {
  static async createOrUpdateProfile(req, res) {
    try {
      const { firebaseUid } = req.params;
      const profileData = { ...req.body };

      delete profileData._id;
      delete profileData.firebaseUid;

      let patient = await Patient.findOne({ firebaseUid });

      if (patient) {
        for (const key in profileData) {
          patient[key] = profileData[key];
        }
        patient.checkProfileCompletion();
        await patient.save();
      } else {
        patient = new Patient({
          firebaseUid,
          ...profileData,
        });
        patient.checkProfileCompletion();
        await patient.save();
      }

      res.json({ success: true, patient });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get patient profile by Mongo _id
  static async getProfile(req, res) {
    try {
      const { patientId } = req.params;

      const patient = await Patient.findById(patientId);

      if (!patient) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }

      res.json({ success: true, patient });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get patient by Firebase UID
  static async getProfileByFirebaseUid(req, res) {
    try {
      const { firebaseUid } = req.params;

      const patient = await Patient.findOne({ firebaseUid });

      if (!patient) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }

      res.json({ success: true, patient });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get patients for a specific doctor
  static async getDoctorPatients(req, res) {
    try {
      const { doctorId } = req.params;
      // Assuming each patient has a field like assignedDoctor or doctorId
      const patients = await Patient.find({ doctorId });
      res.json({ success: true, patients });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = PatientController;
