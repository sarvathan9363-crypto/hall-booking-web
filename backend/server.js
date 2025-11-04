// ===============================================================
// 📁 server.js
// Main entry point for the Hall Booking System Backend
// ===============================================================

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// ===============================================================
// 🌿 INITIAL SETUP & CONFIGURATION
// ===============================================================
dotenv.config(); // Load environment variables
const app = express();

// ===============================================================
// ⚙️ MIDDLEWARE
// ===============================================================
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse incoming JSON payloads

// ===============================================================
// 🗄️ DATABASE CONNECTION
// ===============================================================
connectDB(); // Connect to MongoDB Atlas or local instance

// ===============================================================
// 🚏 ROUTES
// ===============================================================
// Authentication: signup, login, profile (email autofill)
app.use("/api", authRoutes);

// Booking: create, view, cancel
app.use("/api/bookings", bookingRoutes);

// Root endpoint — health check
app.get("/", (req, res) => {
  res.send("✅ Hall Booking API is running successfully...");
});

// ===============================================================
// 🚀 SERVER STARTUP WITH PORT HANDLER
// Handles case if default port is busy
// ===============================================================
const DEFAULT_PORT = parseInt(process.env.PORT) || 5000;
let currentPort = DEFAULT_PORT;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });

  // Handle common errors gracefully
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`⚠️  Port ${port} is busy. Trying port ${port + 1}...`);
      currentPort++;
      startServer(currentPort); // Retry with next available port
    } else {
      console.error("❌ Server error:", err);
      process.exit(1);
    }
  });
}

startServer(currentPort);
