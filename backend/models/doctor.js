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

const doctorSchema = new mongoose.Schema(
  {
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
    phoneNumber: {
      type: String,
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

    education: [educationSchema],

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
    // Professional Details
    bio: {
      type: String,
      default: "",
      maxlength: 1000,
    },
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
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    totalPatients: {
      type: Number,
      default: 0,
    },
    totalAppointments: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["doctor"],
      default: "doctor",
      required: true,
    },
    googleAccessToken: String,
    googleRefreshToken: String,
    googleCalendarId: String,
    googleTokenExpiry: Number,
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
    availability: false,
  };

  this.completedSections = required;
  this.profileCompleted = Object.values(required).slice(0, 4).every(Boolean);

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
doctorSchema.index({ averageRating: -1 });

module.exports = mongoose.model("Doctor", doctorSchema);
