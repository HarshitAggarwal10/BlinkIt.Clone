const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      qty: Number,
      price: Number,
    },
  ],
  subtotal: Number,
  discount: Number,
  total: Number,
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    default: null,
  },
  address: {
    label: String,
    line1: String,
    city: String,
    pincode: String,
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
  },
  status: {
    type: String,
    enum: ["placed", "preparing", "out_for_delivery", "delivered", "cancelled"],
    default: "placed",
  },
  assignedRider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

orderSchema.index({ "address.location": "2dsphere" });
module.exports = mongoose.model("Order", orderSchema);
