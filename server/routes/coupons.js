const express = require("express");
const Coupon = require("../models/Coupon");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

// ===== Admin CRUD =====

// Create coupon
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const c = await Coupon.create(req.body);
    res.json(c);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Coupon code exists" });
    res.status(500).json({ message: "Server error" });
  }
});

// Update coupon
router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete coupon
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===== Public Validation =====
router.get("/:code", async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const subtotal = parseFloat(req.query.subtotal || "0");

    const coupon = await Coupon.findOne({ code, active: true });
    if (!coupon) return res.status(404).json({ message: "Invalid coupon" });

    if (coupon.expiresAt && coupon.expiresAt < new Date())
      return res.status(400).json({ message: "Coupon expired" });

    if (subtotal < coupon.minCartValue)
      return res
        .status(400)
        .json({ message: `Minimum cart value ₹${coupon.minCartValue}` });

    let discount =
      coupon.type === "percent"
        ? (subtotal * coupon.value) / 100
        : coupon.value;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    discount = Math.round(discount * 100) / 100;

    res.json({ valid: true, discount, coupon });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
