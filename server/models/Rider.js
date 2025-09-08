const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  vehicle: String,
  status: { type: String, enum: ['available', 'busy', 'offline'], default: 'offline' },
  location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  socketId: String,
});

riderSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Rider', riderSchema);
