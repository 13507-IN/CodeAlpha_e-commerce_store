const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Middleware to check token
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token missing' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, "143rishi");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

router.post('/', async (req, res) => {
  const { userId, products, total } = req.body;
  const order = await Order.create({ userId, products, total });
  res.json(order);
});

router.get('/user/:userId', auth, async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders || []);
});


module.exports = router;
