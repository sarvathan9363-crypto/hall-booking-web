import React, { useEffect, useState } from "react";
import bookingService from "../api/bookingsService.js";

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("psg_user") || "{}");
  const token = localStorage.getItem("psg_token");

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError(null);
        const res = await bookingService.fetchMyBookings(token);
        const data = res?.bookings || [];

        if (!Array.isArray(data)) throw new Error("Invalid data received from server.");

        setMyBookings(data);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings from server.");
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [token]);

  async function handleCancel(id) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const result = await bookingService.deleteBooking(id, token);
      if (!result.success && result.message) throw new Error(result.message);

      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b)));
      setMyBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b)));

      alert("Booking cancelled successfully.");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Please try again later.");
    }
  }

  const renderBookingCard = (b) => (
    <li
      key={b._id}
      className={`rounded-xl p-4 backdrop-blur-md shadow-md transition transform hover:scale-[1.01] ${
        b.status === "Cancelled"
          ? "bg-gray-200/60 border border-gray-300 text-gray-600"
          : "bg-white/10 border border-white/20 hover:bg-white/20"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-base font-semibold text-white">
            {b.block} Block — Floor {b.floor} — Room {b.room}
          </div>
          <div className="text-xs text-gray-200 mt-1">
            📅 {b.date} • ⏰ {b.timeSlot || b.time}
          </div>
          <div className="text-sm text-white/90 mt-2 italic">
            Purpose: {b.purpose}
          </div>
          <div className="text-xs text-gray-300 mt-2">
            Requested by: {b.email || "Unknown"} •{" "}
            {b.createdAt ? new Date(b.createdAt).toLocaleString() : "No timestamp"}
          </div>

          {b.status && (
            <div
              className={`mt-2 text-xs font-semibold ${
                b.status === "Cancelled" ? "text-red-400" : "text-emerald-400"
              }`}
            >
              Status: {b.status}
            </div>
          )}
        </div>

        {b.status !== "Cancelled" && (
          <button
            onClick={() => handleCancel(b._id)}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-600/80 hover:bg-red-700 transition text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </li>
  );

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-sky-700 to-indigo-700 shadow-xl text-white">
        <h2 className="text-2xl font-semibold">My Hall Bookings</h2>
        <p className="text-sm text-white/80 mb-6">
          Review your scheduled bookings and manage cancellations.
        </p>

        {loading && <p className="text-sm text-white/70 mt-3">Loading bookings...</p>}
        {error && <p className="text-sm text-red-300 mt-3">{error}</p>}

        {!loading && !error && (
          <div className="mt-4">
            {myBookings.length === 0 ? (
              <p className="text-sm text-white/70">No bookings found.</p>
            ) : (
              <ul className="space-y-4">
                {myBookings
                  .slice()
                  .reverse()
                  .map((b) => renderBookingCard(b))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
