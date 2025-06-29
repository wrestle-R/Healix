const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  relationship: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    default: "",
  },
});

const medicalHistorySchema = new mongoose.Schema({
  condition: {
    type: String,
  },
  diagnosedDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "resolved", "chronic"],
    default: "active",
  },
  notes: {
    type: String,
    default: "",
  },
});

const allergySchema = new mongoose.Schema({
  allergen: {
    type: String,
  },
  severity: {
    type: String,
    enum: ["mild", "moderate", "severe"],
  },
  reaction: {
    type: String,
  },
  notes: {
    type: String,
    default: "",
  },
});

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  dosage: {
    type: String,
  },
  frequency: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  prescribedBy: {
    type: String,
  },
  isActive: {
    type: Boolean,
  },
  notes: {
    type: String,
    default: "",
  },
});

const patientSchema = new mongoose.Schema(
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

    // Personal Information
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      default: "single",
      required: false, // <-- Make optional
    },
    phoneNumber: {
      type: String,
    },
    address: {
      street: { type: String, required: false }, // <-- Make optional
      city: { type: String, required: false },
      state: { type: String, required: false },
      zipCode: { type: String, required: false },
      country: { type: String, default: "India", required: false },
    },
    profilePicture: {
      type: String,
      default: "",
    },
    emergencyContacts: [emergencyContactSchema],
    height: {
      value: { type: Number },
      unit: { type: String, default: "cm" },
    },
    weight: {
      value: { type: Number },
      unit: { type: String, default: "kg" },
    },
    medicalHistory: [medicalHistorySchema],
    allergies: {
      type: [allergySchema],
      required: false, // <-- Make optional
      default: undefined,
    },
    currentMedications: [medicationSchema],
    smokingStatus: {
      type: String,
      enum: ["never", "former", "current"],
      default: "never",
    },
    alcoholConsumption: {
      type: String,
      enum: ["never", "occasionally", "regularly", "heavy"],
      default: "never",
    },
    exerciseFrequency: {
      type: String,
      enum: ["none", "rarely", "weekly", "daily"],
      default: "none",
    },
    dietType: {
      type: String,
      enum: ["vegetarian", "non-vegetarian", "vegan", "other"],
      default: "vegetarian",
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["patient"],
      default: "patient",
      required: true,
    },
    googleAccessToken: String,
googleRefreshToken: String,
googleCalendarId: String,
googleTokenExpiry: Number
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
patientSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age calculation
patientSchema.virtual("age").get(function () {
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

patientSchema.virtual("bmi").get(function () {
  if (!this.height?.value || !this.weight?.value) return null;
  const heightInMeters = this.height.value / 100;
  return (this.weight.value / (heightInMeters * heightInMeters)).toFixed(1);
});

patientSchema.methods.checkProfileCompletion = function () {
  const required = {
    personalInfo: !!(
      this.firstName &&
      this.lastName &&
      this.dateOfBirth &&
      this.gender &&
      this.bloodGroup
    ),
    contactInfo: !!this.phoneNumber,
    medicalInfo: !!(this.height?.value && this.weight?.value),
    emergencyContact: this.emergencyContacts.length > 0,
  };

  this.completedSections = required;
  this.profileCompleted = Object.values(required).every(Boolean);

  return this.profileCompleted;
};

// Indexes
patientSchema.index({ phoneNumber: 1 });
patientSchema.index({ "address.city": 1, "address.state": 1 });

module.exports = mongoose.model("Patient", patientSchema);
