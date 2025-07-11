const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check token
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token missing' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, '143rishi');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// POST /api/users/address
router.post('/address', auth, async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.userId,
      { address: req.body },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Address saved', address: user.address });
  } catch (err) {
    console.error('Error saving address:', err);
    res.status(500).json({ message: 'Failed to save address' });
  }
});

// GET /api/users/address 
router.get('/address', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.address) return res.status(404).json({ message: 'Address not found' });
    res.json({ address: user.address });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch address' });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// router.get('/me', auth, async (req, res) => {
//   const user = await User.findById(req.userId);
//   res.json(user);
// });

router.put('/update-address', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.address = req.body.address;
  await user.save();
  res.json({ message: 'Address updated', address: user.address });
});


module.exports = router;
