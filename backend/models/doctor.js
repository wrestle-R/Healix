const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
  },
  institution: {
    type: String,
  },
  year: {
    type: Number,
  },
  specialization: {
    type: String,
    default: "",
  },
});

const experienceSchema = new mongoose.Schema({
  hospital: {
    type: String,
  },
  position: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: "",
  },
});

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  issuingBody: {
    type: String,
  },
  issueDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  certificateNumber: {
    type: String,
    default: "",
  },
});

const doctorSchema = new mongoose.Schema(
  {
    // Basic user info (linked to Firebase Auth)
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Personal Information
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    // Contact Information
    phoneNumber: {
      type: String,
    },
    alternatePhoneNumber: {
      type: String,
      default: "",
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, default: "India" },
    },

    // Professional Information
    medicalLicenseNumber: {
      type: String,
      unique: true,
    },
    specializations: [
      {
        type: String,
      },
    ],
    subSpecializations: [
      {
        type: String,
      },
    ],
    yearsOfExperience: {
      type: Number,
      min: 0,
    },

    // Education & Certifications
    education: [educationSchema],
    certifications: [certificationSchema],
    workExperience: [experienceSchema],

    // Practice Information
    hospitalAffiliations: [
      {
        name: { type: String },
        position: { type: String },
        address: { type: String },
        phone: { type: String, default: "" },
      },
    ],
    clinicAddress: {
      name: { type: String, default: "" },
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
      phone: { type: String, default: "" },
    },

    // Languages spoken
    languages: [
      {
        type: String,
        default: ["English", "Hindi"],
      },
    ],

    // Professional Details
    bio: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    servicesOffered: [
      {
        type: String,
      },
    ],
    consultationModes: [
      {
        type: String,
        enum: ["in-person", "video-call", "phone-call"],
        default: ["in-person", "video-call"],
      },
    ],

    // Verification Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocuments: [
      {
        documentType: {
          type: String,
          enum: ["license", "degree", "certificate", "id-proof"],
        },
        documentUrl: { type: String },
        uploadedAt: { type: Date, default: Date.now },
        verificationStatus: {
          type: String,
          enum: ["pending", "verified", "rejected"],
          default: "pending",
        },
      },
    ],

    // Ratings & Reviews
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    accountStatus: {
      type: String,
      enum: ["pending", "active", "suspended", "deactivated"],
      default: "pending",
    },

    // Profile completion
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    completedSections: {
      personalInfo: { type: Boolean, default: false },
      professionalInfo: { type: Boolean, default: false },
      education: { type: Boolean, default: false },
      verification: { type: Boolean, default: false },
      availability: { type: Boolean, default: false },
    },

    // Statistics
    totalPatients: {
      type: Number,
      default: 0,
    },
    totalAppointments: {
      type: Number,
      default: 0,
    },

    // Preferences
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      appointmentReminders: { type: Boolean, default: true },
      newPatientAlerts: { type: Boolean, default: true },
    },

    role: {
      type: String,
      enum: ["doctor"],
      default: "doctor",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
doctorSchema.virtual("fullName").get(function () {
  return `Dr. ${this.firstName} ${this.lastName}`;
});

// Virtual for age calculation
doctorSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

// Method to check if profile is complete
doctorSchema.methods.checkProfileCompletion = function () {
  const required = {
    personalInfo: !!(
      this.firstName &&
      this.lastName &&
      this.dateOfBirth &&
      this.phoneNumber
    ),
    professionalInfo: !!(
      this.medicalLicenseNumber &&
      this.specializations.length > 0 &&
      this.yearsOfExperience >= 0
    ),
    education: this.education.length > 0,
    verification: this.verificationDocuments.length > 0,
    availability: false, // Will be checked against DoctorAvailability model
  };

  this.completedSections = required;
  this.profileCompleted = Object.values(required).slice(0, 4).every(Boolean); // Exclude availability for now

  return this.profileCompleted;
};

// Method to update ratings
doctorSchema.methods.updateRating = function (newRating) {
  const totalRating = this.averageRating * this.totalReviews + newRating;
  this.totalReviews += 1;
  this.averageRating = totalRating / this.totalReviews;

  return this.averageRating;
};

// Indexes
doctorSchema.index({ specializations: 1 });
doctorSchema.index({ "address.city": 1, "address.state": 1 });
doctorSchema.index({ isVerified: 1, accountStatus: 1 });
doctorSchema.index({ averageRating: -1 });

module.exports = mongoose.model("Doctor", doctorSchema);
