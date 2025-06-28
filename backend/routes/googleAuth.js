// routes/googleAuth.js
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { verifyToken } = require('../middleware/auth');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const crypto = require('crypto');

const oauth2Client = new google.auth.OAuth2(
"493135588851-r45vjhmtuk1pr1hgkojulc51pj40t344.apps.googleusercontent.com",
"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",
"http://localhost:5000/auth/google/callback"

);

console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Redirect URI:', process.env.GOOGLE_REDIRECT_URI);

// Generate Google OAuth URL
router.get('/google/auth-url', verifyToken, (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    state: state,
    prompt: 'consent',  // Ensure we get a refresh token
    redirect_uri: process.env.GOOGLE_REDIRECT_URI  // Explicitly include
  });
  
  res.json({ success: true, url, state });
});

// Handle OAuth callback
// Handle OAuth callback
router.get('/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    console.error('Google OAuth error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/settings?googleAuthError=true`);
  }

  try {
    const { tokens } = await oauth2Client.getToken({ code });
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    // Verify the user exists in your system
    const user = await Patient.findOne({ email: userInfo.data.email }) || 
               await Doctor.findOne({ email: userInfo.data.email });
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/settings?googleAuthError=user_not_found`);
    }

    // Save tokens to user in database
    user.googleAccessToken = tokens.access_token;
    user.googleRefreshToken = tokens.refresh_token;
    user.googleCalendarId = userInfo.data.email;
    await user.save();
    
    // Redirect to patient dashboard instead of settings
    res.redirect(`${process.env.FRONTEND_URL}/patient-dashboard?googleAuthSuccess=true&userId=${user._id}`);
  } catch (err) {
    console.error('Error during Google OAuth callback:', err);
    res.redirect(`${process.env.FRONTEND_URL}/settings?googleAuthError=true`);
  }
});
// Add to googleAuth.js
router.get('/check-credentials/:userId', async (req, res) => {
  const user = await Patient.findById(req.params.userId) || 
               await Doctor.findById(req.params.userId);
  
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    hasAccessToken: !!user.googleAccessToken,
    hasRefreshToken: !!user.googleRefreshToken,
    calendarId: user.googleCalendarId
  });
});

module.exports = router;