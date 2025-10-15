// backend/routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../middleware/auth');

router.get('/profile', authenticate, async (req, res) => {
  try {
    // CRITICAL: Extract UID from verified token
    const { uid, email, name } = req.user; // ← comes from auth middleware

    // CRITICAL: Find or create user by firebaseUid
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = new User({
        firebaseUid: uid, // ← MUST be present
        email,
        name
        // password is omitted (optional)
      });
      await user.save();
    }

    res.json({
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

module.exports = router;