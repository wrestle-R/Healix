const Patient = require("../models/patient");

class PatientController {
  // Create or update patient profile
  static async createOrUpdateProfile(req, res) {
    try {
      const { firebaseUid } = req.params;
      const profileData = { ...req.body };

      // Prevent accidental overwrite of _id or firebaseUid
      delete profileData._id;
      delete profileData.firebaseUid;

      let patient = await Patient.findOne({ firebaseUid });

      if (patient) {
        Object.assign(patient, profileData);
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

  // Get patient profile
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

  // Update medical history
  static async updateMedicalHistory(req, res) {
    try {
      const { patientId } = req.params;
      const { medicalHistory } = req.body;

      const patient = await Patient.findByIdAndUpdate(
        patientId,
        { medicalHistory },
        { new: true }
      );

      if (!patient) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }

      patient.checkProfileCompletion();
      await patient.save();

      res.json({ success: true, patient });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Add emergency contact
  static async addEmergencyContact(req, res) {
    try {
      const { patientId } = req.params;
      const contactData = req.body;

      const patient = await Patient.findById(patientId);

      if (!patient) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }

      patient.emergencyContacts.push(contactData);
      patient.checkProfileCompletion();
      await patient.save();

      res.json({ success: true, patient });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update allergies
  static async updateAllergies(req, res) {
    try {
      const { patientId } = req.params;
      const { allergies } = req.body;

      const patient = await Patient.findByIdAndUpdate(
        patientId,
        { allergies },
        { new: true }
      );

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

  // Update current medications
  static async updateCurrentMedications(req, res) {
    try {
      const { patientId } = req.params;
      const { currentMedications } = req.body;

      const patient = await Patient.findByIdAndUpdate(
        patientId,
        { currentMedications },
        { new: true }
      );

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

  // Get all patients (for doctors)
  static async getAllPatients(req, res) {
    try {
      const { search, page = 1, limit = 20 } = req.query;

      let query = { profileCompleted: true };

      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
        ];
      }

      const patients = await Patient.find(query)
        .select(
          "firstName lastName profilePicture phoneNumber email dateOfBirth gender"
        )
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await Patient.countDocuments(query);

      res.json({
        success: true,
        patients,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get patients with upcoming appointments for a doctor
  static async getDoctorPatients(req, res) {
    try {
      const { doctorId } = req.params;
      const Appointment = require("../models/appointment");

      // Get all appointments for this doctor
      const appointments = await Appointment.find({
        doctorId,
        status: { $in: ["confirmed", "pending"] },
      })
        .populate(
          "patientId",
          "firstName lastName profilePicture phoneNumber email dateOfBirth"
        )
        .sort({ appointmentDate: 1, startTime: 1 });

      // Group by patient and get unique patients
      const patientMap = new Map();

      appointments.forEach((appointment) => {
        const patient = appointment.patientId;
        if (patient && !patientMap.has(patient._id.toString())) {
          patientMap.set(patient._id.toString(), {
            ...patient.toObject(),
            nextAppointment: appointment,
            totalAppointments: 1,
          });
        } else if (patient) {
          const existingPatient = patientMap.get(patient._id.toString());
          existingPatient.totalAppointments += 1;
        }
      });

      const patients = Array.from(patientMap.values());

      res.json({ success: true, patients });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = PatientController;
