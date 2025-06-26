const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true, 
  },
  endTime: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    default: null,
  },
});

const dayAvailabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  slots: [timeSlotSchema],
  reason: {
    type: String,
    default: "", 
  },
});

const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      unique: true,
    },
    // Weekly schedule template
    weeklySchedule: {
      monday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "17:00" },
        breakStartTime: { type: String, default: "13:00" },
        breakEndTime: { type: String, default: "14:00" },
        slotDuration: { type: Number, default: 30 }, 
      },
      tuesday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "17:00" },
        breakStartTime: { type: String, default: "13:00" },
        breakEndTime: { type: String, default: "14:00" },
        slotDuration: { type: Number, default: 30 },
      },
      wednesday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "17:00" },
        breakStartTime: { type: String, default: "13:00" },
        breakEndTime: { type: String, default: "14:00" },
        slotDuration: { type: Number, default: 30 },
      },
      thursday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "17:00" },
        breakStartTime: { type: String, default: "13:00" },
        breakEndTime: { type: String, default: "14:00" },
        slotDuration: { type: Number, default: 30 },
      },
      friday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "17:00" },
        breakStartTime: { type: String, default: "13:00" },
        breakEndTime: { type: String, default: "14:00" },
        slotDuration: { type: Number, default: 30 },
      },
      saturday: {
        isAvailable: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "13:00" },
        breakStartTime: { type: String, default: "" },
        breakEndTime: { type: String, default: "" },
        slotDuration: { type: Number, default: 30 },
      },
      sunday: {
        isAvailable: { type: Boolean, default: false },
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
        breakStartTime: { type: String, default: "" },
        breakEndTime: { type: String, default: "" },
        slotDuration: { type: Number, default: 30 },
      },
    },
    // Specific date overrides and unavailable slots
    specificDates: [dayAvailabilitySchema],

    // Consultation fee
    consultationFee: {
      type: Number,
      required: true,
      default: 500,
    },

    // Emergency availability
    emergencyAvailable: {
      type: Boolean,
      default: false,
    },

    // Advance booking limit (in days)
    advanceBookingLimit: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to generate time slots for a specific day
doctorAvailabilitySchema.methods.generateSlotsForDay = function (date) {
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const daySchedule = this.weeklySchedule[dayOfWeek];

  if (!daySchedule.isAvailable) {
    return [];
  }

  const slots = [];
  const startTime = new Date(`1970-01-01T${daySchedule.startTime}:00`);
  const endTime = new Date(`1970-01-01T${daySchedule.endTime}:00`);
  const breakStart = daySchedule.breakStartTime
    ? new Date(`1970-01-01T${daySchedule.breakStartTime}:00`)
    : null;
  const breakEnd = daySchedule.breakEndTime
    ? new Date(`1970-01-01T${daySchedule.breakEndTime}:00`)
    : null;
  const slotDuration = daySchedule.slotDuration * 60 * 1000; 

  let currentTime = startTime;

  while (currentTime < endTime) {
    const slotEnd = new Date(currentTime.getTime() + slotDuration);

    if (
      breakStart &&
      breakEnd &&
      ((currentTime >= breakStart && currentTime < breakEnd) ||
        (slotEnd > breakStart && slotEnd <= breakEnd))
    ) {
      currentTime = breakEnd;
      continue;
    }

    if (slotEnd <= endTime) {
      slots.push({
        startTime: currentTime.toTimeString().slice(0, 5),
        endTime: slotEnd.toTimeString().slice(0, 5),
        isBooked: false,
      });
    }

    currentTime = slotEnd;
  }

  return slots;
};

// Index for efficient queries
doctorAvailabilitySchema.index({ "specificDates.date": 1 });

module.exports = mongoose.model("DoctorAvailability", doctorAvailabilitySchema);
