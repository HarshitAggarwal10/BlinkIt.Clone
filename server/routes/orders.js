const express = require('express');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { requireAuth, requireRole } = require('../middlewares/auth');
const router = express.Router();

// Apply coupon validation logic
async function applyCoupon(couponCode, userId, subtotal) {
  const coupon = await Coupon.findOne({ code: couponCode, active: true });
  if (!coupon) throw new Error('Invalid coupon');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error('Coupon expired');
  if (subtotal < coupon.minCartValue) throw new Error('Cart value too low for coupon');

  let discount = coupon.type === 'percent'
    ? (subtotal * coupon.value) / 100
    : coupon.value;

  if (coupon.maxDiscount && discount > coupon.maxDiscount)
    discount = coupon.maxDiscount;

  return { discount, coupon };
}

// Place order
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items, address, couponCode } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items in cart' });

    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

    let discount = 0;
    let coupon = null;
    if (couponCode) {
      const result = await applyCoupon(couponCode, req.session.user.id, subtotal);
      discount = result.discount;
      coupon = result.coupon;
    }

    const total = subtotal - discount;

    const order = await Order.create({
      user: req.session.user.id,
      items,
      subtotal,
      discount,
      total,
      coupon: coupon ? coupon._id : null,
      address,
    });

    req.app.get('io').emit('newOrder', order);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Get order details
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'email name')
      .populate('assignedRider', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.session.user.role !== 'admin' && String(order.user._id) !== String(req.session.user.id))
      return res.status(403).json({ message: 'Forbidden' });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign rider
router.put('/:id/assign', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { riderId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedRider: riderId, status: 'out_for_delivery' },
      { new: true }
    );
    req.app.get('io').to('rider_' + riderId).emit('orderAssigned', order);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
