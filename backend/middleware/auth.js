const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    console.log("Decoded token:", decoded);

    // Find the user
    let user;
    if (decoded.role === "patient") {
      user = await Patient.findById(decoded.userId);
    } else if (decoded.role === "doctor") {
      user = await Doctor.findById(decoded.userId);
    }

    console.log(
      "Looking up user by _id:",
      decoded.userId,
      "and role:",
      decoded.role
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    // Add user info to request
    req.user = {
      id: user._id,
      firebaseUid: user.firebaseUid,
      role: decoded.role,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

// Optional: Role-specific middleware
const requireDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Doctor role required.",
    });
  }
  next();
};

const requirePatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Patient role required.",
    });
  }
  next();
};

const generateToken = (userId, firebaseUid, role) => {
  return jwt.sign(
    { userId, firebaseUid, role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );
};

module.exports = { verifyToken, requireDoctor, requirePatient, generateToken };
