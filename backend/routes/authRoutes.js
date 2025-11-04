// ===============================================================
// 📁 routes/authRoutes.js
// Handles user authentication and profile retrieval
// ===============================================================

import express from "express";
import { signup, login, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================================================
// 🧩 AUTH ROUTES
// ===============================================================

// ✅ Register new user
router.post("/signup", signup);

// ✅ Login existing user
router.post("/login", login);

// ✅ Fetch logged-in user profile (used for email autofill)
//    - Requires a valid JWT token
router.get("/profile", protect, getProfile);

// ===============================================================
// 📤 EXPORT ROUTER
// ===============================================================
export default router;
