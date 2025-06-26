const Doctor = require("../models/doctor");

class DoctorController {
  static isProfileComplete(doctor) {
    return (
      doctor.firstName &&
      doctor.lastName &&
      doctor.email &&
      doctor.phoneNumber &&
      doctor.dateOfBirth &&
      doctor.gender &&
      doctor.address &&
      doctor.address.street &&
      doctor.address.city &&
      doctor.address.state &&
      doctor.address.zipCode &&
      doctor.medicalLicenseNumber &&
      Array.isArray(doctor.specializations) &&
      doctor.specializations.length > 0 &&
      doctor.yearsOfExperience !== undefined &&
      doctor.yearsOfExperience !== null &&
      Array.isArray(doctor.education) &&
      doctor.education.length > 0
    );
  }

  // Create or update doctor profile
  static async createOrUpdateProfile(req, res) {
    try {
      const { firebaseUid } = req.params;
      const profileData = { ...req.body };

      // Prevent accidental overwrite of _id or firebaseUid
      delete profileData._id;
      delete profileData.firebaseUid;

      let doctor = await Doctor.findOne({ firebaseUid });

      if (doctor) {
        Object.assign(doctor, profileData);

        if (profileData.education) doctor.education = profileData.education;
        if (profileData.specializations)
          doctor.specializations = profileData.specializations;

        doctor.profileCompleted = DoctorController.isProfileComplete(doctor);

        await doctor.save();
      } else {
        doctor = new Doctor({
          firebaseUid,
          ...profileData,
        });
        doctor.profileCompleted = DoctorController.isProfileComplete(doctor);
        await doctor.save();
      }

      res.json({ success: true, doctor });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get doctor profile
  static async getProfile(req, res) {
    try {
      const { doctorId } = req.params;

      const doctor = await Doctor.findById(doctorId);

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      res.json({ success: true, doctor });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get doctor by Firebase UID
  static async getProfileByFirebaseUid(req, res) {
    try {
      const { firebaseUid } = req.params;

      const doctor = await Doctor.findOne({ firebaseUid });

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      res.json({ success: true, doctor });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Search doctors (only show profileCompleted: true)
  static async searchDoctors(req, res) {
    try {
      const {
        specialty,
        city,
        state,
        minRating,
        maxFee,
        search,
        page = 1,
        limit = 12,
      } = req.query;

      let query = {
        profileCompleted: true,
      };

      if (specialty) {
        query.specializations = { $in: [specialty] };
      }
      if (city) {
        query["address.city"] = new RegExp(city, "i");
      }
      if (state) {
        query["address.state"] = new RegExp(state, "i");
      }
      if (minRating) {
        query.averageRating = { $gte: parseFloat(minRating) };
      }
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { specializations: { $in: [new RegExp(search, "i")] } },
          { "address.city": { $regex: search, $options: "i" } },
        ];
      }

      let doctors = await Doctor.find(query)
        .select(
          "firstName lastName specializations averageRating totalReviews profilePicture address bio yearsOfExperience"
        )
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ averageRating: -1 });

      // Get consultation fees for each doctor
      const DoctorAvailability = require("../models/doctorAvailability");
      const doctorsWithFees = await Promise.all(
        doctors.map(async (doctor) => {
          const availability = await DoctorAvailability.findOne({
            doctorId: doctor._id,
          });
          return {
            ...doctor.toObject(),
            consultationFee: availability?.consultationFee || 500,
          };
        })
      );

      // Filter by max fee if provided
      let filteredDoctors = doctorsWithFees;
      if (maxFee) {
        filteredDoctors = doctorsWithFees.filter(
          (doctor) => doctor.consultationFee <= parseFloat(maxFee)
        );
      }

      const total = await Doctor.countDocuments(query);

      res.json({
        success: true,
        doctors: filteredDoctors,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get doctor's detailed profile for booking
  static async getDoctorDetails(req, res) {
    try {
      const { doctorId } = req.params;

      const doctor = await Doctor.findById(doctorId).select(
        "-verificationDocuments -__v"
      );

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      // Get availability and fees
      const DoctorAvailability = require("../models/doctorAvailability");
      const availability = await DoctorAvailability.findOne({ doctorId });

      const doctorWithDetails = {
        ...doctor.toObject(),
        consultationFee: availability?.consultationFee || 500,
        weeklySchedule: availability?.weeklySchedule || null,
      };

      res.json({ success: true, doctor: doctorWithDetails });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update doctor's education
  static async updateEducation(req, res) {
    try {
      const { doctorId } = req.params;
      const { education } = req.body;

      const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { education },
        { new: true }
      );

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      doctor.checkProfileCompletion();
      await doctor.save();

      res.json({ success: true, doctor });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update doctor's experience
  static async updateExperience(req, res) {
    try {
      const { doctorId } = req.params;
      const { workExperience } = req.body;

      const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { workExperience },
        { new: true }
      );

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      res.json({ success: true, doctor });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Add certification
  static async addCertification(req, res) {
    try {
      const { doctorId } = req.params;
      const certificationData = req.body;

      const doctor = await Doctor.findById(doctorId);

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      doctor.certifications.push(certificationData);
      await doctor.save();

      res.json({ success: true, doctor });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get specializations list
  static async getSpecializations(req, res) {
    try {
      const specializations = await Doctor.distinct("specializations", {
        profileCompleted: true,
      });

      res.json({ success: true, specializations: specializations.sort() });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get cities where doctors are available
  static async getAvailableCities(req, res) {
    try {
      const cities = await Doctor.distinct("address.city", {
        profileCompleted: true,
      });

      res.json({ success: true, cities: cities.sort() });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = DoctorController;
