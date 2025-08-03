const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

// Create Product
router.post('/create-product', [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Error creating product' });
  }
});

// Get All Products
router.get('/all-product', async (req, res) => {
  try {
    const products = await Product.find().populate('description', 'name');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

module.exports = router;
