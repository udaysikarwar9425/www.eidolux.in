const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Booking = require("../models/Booking");
const { protect, adminOnly } = require("../middleware/auth");

// @route  GET /api/admin/users
// @desc   Get all users
// @access Admin
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route  GET /api/admin/stats
// @desc   Get dashboard stats
// @access Admin
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers     = await User.countDocuments({ role: "customer" });
    const totalBookings  = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: { $in: ["Active", "Confirmed"] } });
    const pendingBookings = await Booking.countDocuments({ status: "Pending" });

    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: ["Active", "Confirmed", "Completed"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      stats: { totalUsers, totalBookings, activeBookings, pendingBookings, totalRevenue },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route  PUT /api/admin/users/:id/role
// @desc   Change user role
// @access Admin
router.put("/users/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["customer", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "Role updated", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
