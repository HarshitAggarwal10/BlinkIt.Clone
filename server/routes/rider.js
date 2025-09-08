const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Order = require('../models/Order');
const { requireAuth, requireRole } = require('../middlewares/auth');
const router = express.Router();

// Rider login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const rider = await User.findOne({ email, role: 'rider' });
    if (!rider) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, rider.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.user = { id: rider._id, email: rider.email, role: 'rider' };
    res.json({ message: 'Rider logged in', user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rider update location
router.patch('/location', requireAuth, requireRole('rider'), async (req, res) => {
  try {
    const { lat, lng } = req.body;
    await User.findByIdAndUpdate(req.session.user.id, {
      location: { type: 'Point', coordinates: [lng, lat] },
    });
    res.json({ message: 'Location updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rider update order status
router.put('/orders/:id/status', requireAuth, requireRole('rider'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    req.app.get('io').to('order_' + req.params.id).emit('order:status', order);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
