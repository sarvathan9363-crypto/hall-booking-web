// ===============================================================
// 📁 routes/bookingRoutes.js
// Defines booking-related routes
// All routes are protected with JWT middleware (email auto-filled)
// ===============================================================

import express from "express";
import {
  createBooking,
  getBookingsByEmail,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================================================
// 🏠 POST /api/bookings
// → Create a new booking (email auto-filled from JWT)
// ===============================================================
router.post("/", protect, createBooking);

// ===============================================================
// 📋 GET /api/bookings
// → Get all bookings of logged-in user (auto email from JWT)
// ===============================================================
router.get("/", protect, getBookingsByEmail);

// ===============================================================
// ❌ DELETE /api/bookings/:id
// → Cancel booking (only user’s own bookings allowed)
// ===============================================================
router.delete("/:id", protect, cancelBooking);

// ===============================================================
// ✅ Export router
// ===============================================================
export default router;
