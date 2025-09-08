const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin', 'rider'], default: 'user' },
  addresses: [
    {
      label: String,
      line1: String,
      city: String,
      state: String,
      pincode: String,
      location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ 'addresses.location': '2dsphere' });
module.exports = mongoose.model('User', userSchema);
