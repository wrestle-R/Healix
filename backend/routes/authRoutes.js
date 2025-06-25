const express = require('express');
const { createUser, validateRole, getUserByFirebaseId } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/create-user - Create user in MongoDB after Firebase registration
router.post('/create-user', createUser);

// POST /api/auth/validate-role - Validate user role during login
router.post('/validate-role', validateRole);

// GET /api/auth/user/:firebaseId - Get user by Firebase ID
router.get('/user/:firebaseId', getUserByFirebaseId);

module.exports = router;
