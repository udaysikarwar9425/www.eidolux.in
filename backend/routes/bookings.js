const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { protect, adminOnly } = require("../middleware/auth");

// ─── CUSTOMER ROUTES ───────────────────────────────────────────────

// @route  GET /api/bookings/my
// @desc   Get current user's bookings
// @access Private
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route  GET /api/bookings/my/active
// @desc   Get active bookings for current user
// @access Private
router.get("/my/active", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      status: { $in: ["Active", "Confirmed"] },
    }).sort({ startDate: 1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─── ADMIN ROUTES ──────────────────────────────────────────────────

// @route  GET /api/bookings/admin/all
// @desc   Get all bookings (admin)
// @access Admin
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name email phone businessName")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route  POST /api/bookings/admin/create
// @desc   Admin creates a booking for a customer
// @access Admin
router.post("/admin/create", protect, adminOnly, async (req, res) => {
  try {
    const {
      userId,
      clientName,
      businessName,
      location,
      startDate,
      endDate,
      packageType,
      adDescription,
      status,
      amount,
      notes,
    } = req.body;

    if (!userId || !clientName || !startDate || !endDate || !packageType) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const booking = await Booking.create({
      user: userId,
      clientName,
      businessName,
      location: location || "Jayendraganj Nadi Gate, Gwalior, MP",
      startDate,
      endDate,
      packageType,
      adDescription,
      status: status || "Pending",
      amount: amount || 0,
      notes,
    });

    const populated = await booking.populate("user", "name email phone");
    res.status(201).json({ success: true, message: "Booking created", booking: populated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route  PUT /api/bookings/admin/:id
// @desc   Admin updates booking status / details
// @access Admin
router.put("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const updatable = ["status", "startDate", "endDate", "packageType", "amount", "notes", "adDescription", "location"];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) booking[field] = req.body[field];
    });

    await booking.save();
    const updated = await Booking.findById(booking._id).populate("user", "name email phone");
    res.json({ success: true, message: "Booking updated", booking: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route  DELETE /api/bookings/admin/:id
// @desc   Admin deletes a booking
// @access Admin
router.delete("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
