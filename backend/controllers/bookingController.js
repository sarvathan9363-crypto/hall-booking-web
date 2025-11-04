// ===============================================================
// 📁 controllers/bookingController.js
// Handles hall booking CRUD operations
// Automatically fills email from JWT-authenticated user (req.user)
// ===============================================================

import Booking from "../models/Booking.js";

// ===============================================================
// 🏠 Create a New Booking (Email auto-filled from JWT)
// ===============================================================
export const createBooking = async (req, res) => {
  try {
    // ✅ Auto-fill email from authenticated user (via protect middleware)
    const email = req.user?.email;
    const { block, floor, room, date, time, purpose } = req.body;

    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: user email not found" });
    }

    if (!block || !floor || !room || !date || !time || !purpose) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // ✅ Prevent duplicate booking for same slot
    const existing = await Booking.findOne({ block, floor, room, date, time });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Slot already booked" });
    }

    // ✅ Create new booking (email auto-filled)
    const booking = await Booking.create({
      email,
      block,
      floor,
      room,
      date,
      time,
      purpose,
    });

    return res.status(201).json({
      success: true,
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    console.error("❌ Booking Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error during booking",
      error: err.message,
    });
  }
};

// ===============================================================
// 📋 Get All Bookings of Logged-in User
// ===============================================================
export const getBookingsByEmail = async (req, res) => {
  try {
    const email = req.user?.email;

    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: user email not found" });
    }

    const bookings = await Booking.find({ email }).sort({ date: 1, time: 1 });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (err) {
    console.error("❌ Fetch My Bookings Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: err.message,
    });
  }
};

// ===============================================================
// ❌ Cancel Booking (Only the same user can cancel)
// ===============================================================
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.user?.email;

    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: user email not found" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // ✅ Ensure user can cancel only their own booking
    if (booking.email !== email) {
      return res.status(403).json({
        success: false,
        message: "You can cancel only your own bookings",
      });
    }

    await booking.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (err) {
    console.error("❌ Cancel Booking Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error cancelling booking",
      error: err.message,
    });
  }
};
