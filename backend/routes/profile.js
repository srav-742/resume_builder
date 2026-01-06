// routes/profile.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { uid } = req.user;
    const updateData = req.body;

    // Handle special conversions
    if (updateData.dateOfBirth) updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    if (updateData.mobile) updateData.phone = updateData.mobile;

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;