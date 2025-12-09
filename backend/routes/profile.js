// backend/routes/profile.js

const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET user profile
router.get('/', async (req, res) => {
  try {
    const { uid } = req.user; // ✅ use `uid` (from auth.js)
    if (!uid) {
      return res.status(400).json({ error: 'User UID not found' });
    }

    const user = await User.findOne({ firebaseUid: uid }); // ✅ match against `firebaseUid` in DB
    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    res.json({
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth || '',
      mobile: user.mobile || '',
      address: user.address || '',
      gender: user.gender || '',
      profilePicture: user.profilePicture || '',
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT update profile
router.put('/', async (req, res) => {
  try {
    const { uid } = req.user; // ✅
    if (!uid) {
      return res.status(400).json({ error: 'User UID not found' });
    }

    const { dateOfBirth, mobile, address, gender, profilePicture } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid }, // ✅ match by `firebaseUid`
      { $set: { dateOfBirth, mobile, address, gender, profilePicture } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      mobile: user.mobile,
      address: user.address,
      gender: user.gender,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;