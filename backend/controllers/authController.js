const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const jwt = require("jsonwebtoken");

const generateToken = (userId, firebaseUid, role) => {
  return jwt.sign(
    { userId, firebaseUid, role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );
};

const createUser = async (req, res) => {
  try {
    console.log("Received create user request:", req.body);

    const { firebaseUid, name, email, profilePicture, role } = req.body;

    if (!firebaseUid || !name || !email || !role) {
      console.log("Missing required fields:", {
        firebaseUid: !!firebaseUid,
        name: !!name,
        email: !!email,
        role: !!role,
      });
      return res.status(400).json({
        message:
          "Missing required fields: firebaseUid, name, email, and role are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    if (name.trim().length === 0) {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }

    const existingPatient = await Patient.findOne({ firebaseUid });
    const existingDoctor = await Doctor.findOne({ firebaseUid });

    if (existingPatient || existingDoctor) {
      console.log("User already exists with Firebase ID:", firebaseUid);
      return res.status(409).json({
        message: "User already exists with this Firebase ID",
      });
    }

    const existingEmailPatient = await Patient.findOne({ email });
    const existingEmailDoctor = await Doctor.findOne({ email });

    if (existingEmailPatient || existingEmailDoctor) {
      console.log("User already exists with email:", email);
      return res.status(409).json({
        message: "User already exists with this email address",
      });
    }

    let user;
    if (role === "doctor") {
      user = new Doctor({
        firebaseUid,
        name: name.trim(),
        email: email.toLowerCase(),
        profilePicture: profilePicture || "",
        role,
      });
    } else if (role === "patient") {
      user = new Patient({
        firebaseUid,
        name: name.trim(),
        email: email.toLowerCase(),
        profilePicture: profilePicture || "",
        role,
      });
    } else {
      return res.status(400).json({
        message: 'Invalid role. Must be either "doctor" or "patient"',
      });
    }

    console.log("Attempting to save user:", {
      firebaseUid: firebaseUid,
      name: name.trim(),
      email: email.toLowerCase(),
      role,
    });
    await user.save();
    console.log("User saved successfully");

    // Generate JWT token
    const token = generateToken(user._id, user.firebaseUid, user.role);

    // When sending user data in responses:
    res.status(201).json({
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid, 
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.log("Duplicate key error for field:", field);
      return res.status(409).json({
        message: `User with this ${field} already exists`,
      });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation failed: " + validationErrors.join(", "),
      });
    }

    res.status(500).json({
      message: "Failed to create user account. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Validate user role during login
const validateRole = async (req, res) => {
  try {
    const { firebaseUid, role } = req.body;

    // Validate required fields
    if (!firebaseUid || !role) {
      return res.status(400).json({
        message: "Missing required fields: firebaseUid and role are required",
      });
    }

    let user;
    if (role === "doctor") {
      user = await Doctor.findOne({ firebaseUid });
      if (!user) {
        return res.status(403).json({
          message:
            "You are not registered as a doctor. Please register as a doctor first or login as a patient.",
        });
      }
    } else if (role === "patient") {
      user = await Patient.findOne({ firebaseUid });
      if (!user) {
        return res.status(403).json({
          message:
            "You are not registered as a patient. Please register as a patient first or login as a doctor.",
        });
      }
    } else {
      return res.status(400).json({
        message: 'Invalid role. Must be either "doctor" or "patient"',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.firebaseUid, user.role);

    res.status(200).json({
      message: "Role validated successfully",
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error validating role:", error);
    res.status(500).json({
      message: "Failed to validate user role. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get user by Firebase ID
const getUserByFirebaseUid = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    let user = await Patient.findOne({ firebaseUid });
    if (!user) {
      user = await Doctor.findOne({ firebaseUid });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.firebaseUid, user.role);

    res.status(200).json({
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createUser,
  validateRole,
  getUserByFirebaseUid,
};
