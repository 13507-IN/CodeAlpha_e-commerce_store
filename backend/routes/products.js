const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products with optional limit
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit); // ?limit=10
    const products = limit
      ? await Product.find().limit(limit)
      : await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// In routes/product.js
// router.get('/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });



module.exports = router;
