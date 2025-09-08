// backend/routes/adminRoutes.js
const express = require('express');
const Product = require('../models/Product');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create product
router.post('/products', requireAuth, requireRole('admin'), async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// Get all products
router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Update product
router.put('/products/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// Delete product
router.delete('/products/:id', requireAuth, requireRole('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
