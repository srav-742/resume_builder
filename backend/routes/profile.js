// routes/profile.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { uid } = req.user; // from authenticate middleware
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      name: user.name || '',
      email: user.email,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
      mobile: user.phone || '',        // ✅ model uses 'phone'
      address: user.address || '',
      gender: user.gender || '',
      profilePicture: user.profilePicture || ''
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { uid } = req.user;
    const { dateOfBirth, mobile, address, gender, profilePicture } = req.body;

    // Convert empty strings to undefined to avoid enum errors
    const updateData = {
      phone: mobile || undefined,        // ✅ maps to 'phone' in model
      address: address || undefined,
      profilePicture: profilePicture || undefined,
      gender: gender && gender !== '' ? gender : undefined, // ✅ critical!
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
    };

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
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
      mobile: user.phone || '',
      address: user.address || '',
      gender: user.gender || '',
      profilePicture: user.profilePicture || ''
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;