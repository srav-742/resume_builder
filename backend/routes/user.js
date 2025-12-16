// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../middleware/auth');

// GET /api/user/profile → sync user from Firebase token
router.get('/profile', authenticate, async (req, res) => {
  try {
    const { uid, email, name } = req.user;

    // Find or create user (only set essential fields)
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      console.log(`Creating new user for UID: ${uid}`);
      user = new User({
        firebaseUid: uid,
        email,
        name // may be null — that's okay
      });
      await user.save();
      console.log(`User created successfully: ${user._id}`);
    } else {
      console.log(`User found: ${user._id}`);
    }

    res.json({
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      // Only send minimal data here — full profile comes from /api/profile
    });
  } catch (error) {
    console.error('User sync error detailed:', error);
    res.status(500).json({ error: 'Failed to sync user', details: error.message });
  }
});

module.exports = router;