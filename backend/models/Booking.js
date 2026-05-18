const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      default: "Jayendraganj Nadi Gate, Gwalior, MP",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    packageType: {
      type: String,
      enum: ["Daily Slot", "Weekend Package", "Weekly Branding", "Custom"],
      required: true,
    },
    adCreativeUrl: {
      type: String,
      default: "",
    },
    adDescription: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Active", "Completed", "Cancelled"],
      default: "Pending",
    },
    amount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
