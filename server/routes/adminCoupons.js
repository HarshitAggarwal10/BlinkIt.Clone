const express = require('express');
const Coupon = require('../models/Coupon');
const { requireAuth, requireRole } = require('../middlewares/auth');
const router = express.Router();

// Create coupon
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all coupons
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

// Update coupon
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(coupon);
});

// Delete coupon
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
