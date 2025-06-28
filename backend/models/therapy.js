const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: String,
    required: true, // e.g., 'arm-raise', 'squat', 'balance'
  },
  exerciseName: {
    type: String,
    required: true, // e.g., 'Arm Raise Therapy'
  },
  modelPath: {
    type: String,
    required: true, // e.g., '/models/Arms_Up.glb'
  },
  duration: {
    type: Number,
    required: true, // Duration in minutes
  },
  repsTarget: {
    type: Number,
    default: 10, // Default reps target
  },
  instructions: {
    type: String,
    required: true, // e.g., 'Raise your arms slowly and follow the instructor'
  },
  order: {
    type: Number,
    required: true, // Order in the routine (1, 2, 3...)
  }
});

const therapySchema = new mongoose.Schema(
  {
    routineName: {
      type: String,
      required: true,
      unique: true, // e.g., 'Post-Stroke Recovery', 'Senior Fitness'
    },
    description: {
      type: String,
      required: true, // Brief description of what this routine helps with
    },
    longDescription: {
      type: String,
      required: true, // Detailed description of benefits
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    totalDuration: {
      type: Number,
      required: true, // Total duration in minutes
    },
    targetConditions: [{
      type: String, // e.g., 'Stroke Recovery', 'Arthritis', 'Balance Issues'
    }],
    exercises: [exerciseSchema], // Array of exercises in order
    category: {
      type: String,
      enum: ['Rehabilitation', 'Strength', 'Balance', 'Flexibility', 'Cardio'],
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: String,
      default: 'System' // Can be 'System' or doctor ID later
    },
    thumbnailImage: {
      type: String,
      default: '/images/therapy-default.jpg' // Thumbnail for display
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
therapySchema.index({ category: 1, difficulty: 1 });
therapySchema.index({ targetConditions: 1 });

module.exports = mongoose.model("Therapy", therapySchema);