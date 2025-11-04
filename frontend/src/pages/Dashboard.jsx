// ===============================================================
// 📁 src/pages/Dashboard.jsx
// User Dashboard — With Booking Animation on Right Side
// ===============================================================

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyBookings } from "../api/bookingsService.js";
import Lottie from "lottie-react";
import bookingAnimation from "../assets/booking-animation.json"; // ✅ Correct path

export default function Dashboard() {
  const [myBookings, setMyBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load logged-in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("psg_user"));
    setUser(storedUser || null);
  }, []);

  // ✅ Fetch user's bookings
  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError(null);
        const myRes = await fetchMyBookings();
        const myList = Array.isArray(myRes)
          ? myRes
          : Array.isArray(myRes.bookings)
          ? myRes.bookings
          : [];
        setMyBookings(myList);
      } catch (err) {
        console.error("❌ Error loading bookings:", err);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  // ===============================================================
  // 🧩 RENDERING
  // ===============================================================
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 bg-gray-100 gap-10">
      {/* ================================
          RIGHT SECTION: Animation
         ================================ */}
      <div className="flex-1 flex justify-center items-center">
        <Lottie
          animationData={bookingAnimation}
          loop
          className="w-80 h-80 md:w-[400px] md:h-[400px]"
        />
      </div>
      {/* ================================
    LEFT SECTION: Welcome + Bookings
   ================================ */}
<div className="flex-[1.6] max-w-3xl w-full space-y-10">
  
  {/* Welcome Section */}
  <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-lg">
    <h2 className="text-3xl font-semibold text-gray-800">
      Welcome, {user?.name || "User"}
    </h2>
    <p className="text-base text-gray-600 mt-2">
      View and manage your hall bookings with ease and convenience.
    </p>

    <div className="mt-8 flex justify-center gap-6">
      <Link
        to="/book"
        className="px-6 py-3 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
      >
        Book a Hall
      </Link>
      <Link
        to="/bookings"
        className="px-6 py-3 rounded-md text-base font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
      >
        Manage All Bookings
      </Link>
    </div>
  </div>

  {/* My Bookings Section */}
  <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-lg">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      My Bookings
    </h3>

    {loading && (
      <p className="text-sm text-gray-500 animate-pulse">
        Loading your bookings...
      </p>
    )}
    {error && <p className="text-sm text-red-600">{error}</p>}

    {!loading && !error && (
      <>
        {myBookings.length === 0 ? (
          <p className="text-sm text-gray-500">
            You have no bookings yet.
          </p>
        ) : (
          <ul className="mt-5 space-y-4 text-left">
            {myBookings
              .slice()
              .reverse()
              .map((b) => (
                <li
                  key={b._id || b.id}
                  className="rounded-lg p-5 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition"
                >
                  <div className="text-sm font-medium text-gray-800">
                    {b.block} Block — Floor {b.floor} — Room {b.room}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    📅 {b.date} • ⏰ {b.time}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 italic">
                    Purpose: {b.purpose || "Not specified"}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </>
    )}
  </div>
</div>
    </div>
  );
}
