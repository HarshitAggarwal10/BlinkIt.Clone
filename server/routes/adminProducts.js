const express = require('express');
const Product = require('../models/Product');
const { requireAuth, requireRole } = require('../middlewares/auth');
const router = express.Router();

// Create product
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const p = new Product(req.body);
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
