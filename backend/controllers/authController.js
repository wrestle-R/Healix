const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

// Create user in MongoDB after Firebase registration
const createUser = async (req, res) => {
  try {
    console.log('Received create user request:', req.body);
    
    const { firebaseId, name, email, profilePicture, role } = req.body;

    // Validate required fields
    if (!firebaseId || !name || !email || !role) {
      console.log('Missing required fields:', { firebaseId: !!firebaseId, name: !!name, email: !!email, role: !!role });
      return res.status(400).json({ 
        message: 'Missing required fields: firebaseId, name, email, and role are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format' 
      });
    }

    // Validate name (no empty or only whitespace)
    if (name.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Name cannot be empty' 
      });
    }

    // Check if user already exists
    const existingPatient = await Patient.findOne({ firebaseId });
    const existingDoctor = await Doctor.findOne({ firebaseId });

    if (existingPatient || existingDoctor) {
      console.log('User already exists with Firebase ID:', firebaseId);
      return res.status(409).json({ 
        message: 'User already exists with this Firebase ID' 
      });
    }

    // Check if email already exists
    const existingEmailPatient = await Patient.findOne({ email });
    const existingEmailDoctor = await Doctor.findOne({ email });

    if (existingEmailPatient || existingEmailDoctor) {
      console.log('User already exists with email:', email);
      return res.status(409).json({ 
        message: 'User already exists with this email address' 
      });
    }

    let user;
    if (role === 'doctor') {
      user = new Doctor({
        firebaseId,
        name: name.trim(),
        email: email.toLowerCase(),
        profilePicture: profilePicture || '',
        role
      });
    } else if (role === 'patient') {
      user = new Patient({
        firebaseId,
        name: name.trim(),
        email: email.toLowerCase(),
        profilePicture: profilePicture || '',
        role
      });
    } else {
      return res.status(400).json({ 
        message: 'Invalid role. Must be either "doctor" or "patient"' 
      });
    }

    console.log('Attempting to save user:', { firebaseId, name: name.trim(), email: email.toLowerCase(), role });
    await user.save();
    console.log('User saved successfully');

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        firebaseId: user.firebaseId,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.log('Duplicate key error for field:', field);
      return res.status(409).json({ 
        message: `User with this ${field} already exists` 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed: ' + validationErrors.join(', ')
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create user account. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Validate user role during login
const validateRole = async (req, res) => {
  try {
    const { firebaseId, role } = req.body;

    // Validate required fields
    if (!firebaseId || !role) {
      return res.status(400).json({ 
        message: 'Missing required fields: firebaseId and role are required' 
      });
    }

    let user;
    if (role === 'doctor') {
      user = await Doctor.findOne({ firebaseId });
      if (!user) {
        return res.status(403).json({ 
          message: 'You are not registered as a doctor. Please register as a doctor first or login as a patient.' 
        });
      }
    } else if (role === 'patient') {
      user = await Patient.findOne({ firebaseId });
      if (!user) {
        return res.status(403).json({ 
          message: 'You are not registered as a patient. Please register as a patient first or login as a doctor.' 
        });
      }
    } else {
      return res.status(400).json({ 
        message: 'Invalid role. Must be either "doctor" or "patient"' 
      });
    }

    res.status(200).json({
      message: 'Role validated successfully',
      user: {
        id: user._id,
        firebaseId: user.firebaseId,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error validating role:', error);
    res.status(500).json({ 
      message: 'Failed to validate user role. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user by Firebase ID
const getUserByFirebaseId = async (req, res) => {
  try {
    const { firebaseId } = req.params;

    let user = await Patient.findOne({ firebaseId });
    if (!user) {
      user = await Doctor.findOne({ firebaseId });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        firebaseId: user.firebaseId,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createUser,
  validateRole,
  getUserByFirebaseId
};
