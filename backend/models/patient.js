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

const insuranceSchema = new mongoose.Schema({
  provider: {
    type: String,
  },
  policyNumber: {
    type: String,
  },
  groupNumber: {
    type: String,
    default: "",
  },
  validTill: {
    type: Date,
  },
  copayAmount: {
    type: Number,
    default: 0,
  },
});

const patientSchema = new mongoose.Schema(
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

    // Profile
    profilePicture: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "",
    },

    // Emergency Contact
    emergencyContacts: [emergencyContactSchema],

    // Medical Information
    height: {
      value: { type: Number }, // in cm
      unit: { type: String, default: "cm" },
    },
    weight: {
      value: { type: Number }, // in kg
      unit: { type: String, default: "kg" },
    },
    medicalHistory: [medicalHistorySchema],
    allergies: [allergySchema],
    currentMedications: [medicationSchema],
    surgicalHistory: [
      {
        procedure: { type: String },
        date: { type: Date },
        hospital: { type: String },
        surgeon: { type: String, default: "" },
        complications: { type: String, default: "" },
        notes: { type: String, default: "" },
      },
    ],

    // Lifestyle Information
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

    // Insurance Information
    insurance: insuranceSchema,

    // Family Medical History
    familyHistory: [
      {
        relation: { type: String }, // father, mother, sibling, etc.
        conditions: [{ type: String }],
        ageOfDiagnosis: { type: Number },
        notes: { type: String, default: "" },
      },
    ],

    // Profile completion status
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    completedSections: {
      personalInfo: { type: Boolean, default: false },
      contactInfo: { type: Boolean, default: false },
      medicalInfo: { type: Boolean, default: false },
      emergencyContact: { type: Boolean, default: false },
      insurance: { type: Boolean, default: false },
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Preferences
    preferredLanguage: {
      type: String,
      default: "English",
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      appointmentReminders: { type: Boolean, default: true },
      medicationReminders: { type: Boolean, default: true },
    },
    role: {
      type: String,
      enum: ["patient"],
      default: "patient",
      required: true,
    },
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

// Virtual for BMI calculation
patientSchema.virtual("bmi").get(function () {
  if (!this.height?.value || !this.weight?.value) return null;
  const heightInMeters = this.height.value / 100;
  return (this.weight.value / (heightInMeters * heightInMeters)).toFixed(1);
});

// Method to check if profile is complete
patientSchema.methods.checkProfileCompletion = function () {
  const required = {
    personalInfo: !!(
      this.firstName &&
      this.lastName &&
      this.dateOfBirth &&
      this.gender &&
      this.bloodGroup
    ),
    contactInfo: !!(
      this.phoneNumber &&
      this.address.street &&
      this.address.city &&
      this.address.state &&
      this.address.zipCode
    ),
    medicalInfo: !!(this.height?.value && this.weight?.value),
    emergencyContact: this.emergencyContacts.length > 0,
    insurance: false, // Optional for now
  };

  this.completedSections = required;
  this.profileCompleted = Object.values(required).every(Boolean);

  return this.profileCompleted;
};

// Indexes
patientSchema.index({ phoneNumber: 1 });
patientSchema.index({ "address.city": 1, "address.state": 1 });

module.exports = mongoose.model("Patient", patientSchema);
