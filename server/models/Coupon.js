const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  type: { type: String, enum: ['percent', 'fixed'] },
  value: Number,
  minCartValue: { type: Number, default: 0 },
  maxDiscount: Number,
  usageLimit: Number, // total uses across users
  perUserLimit: Number,
  usedBy: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      count: { type: Number, default: 0 },
    },
  ],
  expiresAt: Date,
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Coupon', couponSchema);
