import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signin from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import BookHall from "./pages/BookHall";
import BookingsList from "./pages/BookingsList";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import {
  fetchAllBookings,
  createBooking,
  deleteBooking,
} from "./api/bookingsService";

export default function App() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // ✅ Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("psg_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ✅ Fetch bookings whenever user logs in/out
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }

    async function loadBookings() {
      setLoadingBookings(true);
      try {
        const data = await fetchAllBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error loading bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    }

    loadBookings();
  }, [user]);

  // ✅ Logout handler
  function handleLogout() {
    localStorage.removeItem("psg_user");
    setUser(null);
  }

  // ✅ Add new booking
  async function addBooking(booking) {
    try {
      const newBooking = await createBooking(booking);
      setBookings((prev) => [...prev, newBooking]);
    } catch (err) {
      console.error("❌ Booking creation failed:", err);
    }
  }

  // ✅ Cancel a booking
  async function cancelBooking(id) {
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("❌ Booking cancellation failed:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />

          {/* Signup route */}
          <Route path="/signin" element={<Signin setUser={setUser} />} />

          {/* Dashboard (Protected) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={user}>
                <Dashboard
                  user={user}
                  bookings={bookings}
                  loading={loadingBookings}
                />
              </PrivateRoute>
            }
          />

          {/* Book Hall (Protected) */}
          <Route
            path="/book"
            element={
              <PrivateRoute user={user}>
                <BookHall onBook={addBooking} user={user} />
              </PrivateRoute>
            }
          />

          {/* Bookings List (Protected) */}
          <Route
            path="/bookings"
            element={
              <PrivateRoute user={user}>
                <BookingsList bookings={bookings} onCancel={cancelBooking} />
              </PrivateRoute>
            }
          />

          {/* ✅ Added alias route for /mybookings */}
          <Route
            path="/mybookings"
            element={
              <PrivateRoute user={user}>
                <BookingsList bookings={bookings} onCancel={cancelBooking} />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
