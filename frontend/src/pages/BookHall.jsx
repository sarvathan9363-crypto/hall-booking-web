// ===============================================================
// 📁 src/pages/BookHall.jsx
// Book a Hall — With Booking Calendar Animation
// ===============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../api/bookingsService.js";
import Lottie from "lottie-react";
import bookingCalendar from "../assets/Booking Calender.json"; // ✅ Ensure correct file name & path

const TIME_SLOTS = [
  "8.30-9.20", "9.20-10.10", "10.30-11.20", "11.20-12.10",
  "1.40-2.30", "2.30-3.20", "3.30-4.20", "4.20-5.10",
  "5.30-6.20", "6.20-7.10", "7.15-8.05", "8.05-8.55",
];

const BLOCKS = ["A", "B", "F", "G", "J", "K", "M"];

function generateRooms(block) {
  const floors = {};
  const numFloors = block === "F" ? 4 : 5;
  for (let f = 0; f < numFloors; f++) {
    const floorName = block === "F" ? f + 1 : f;
    let rooms = [];
    if (block === "F") {
      rooms.push("Assembly Hall");
    } else {
      const startNum = f === 0 ? 101 : f * 100 + 1;
      const endNum = f === 0 ? 110 : f * 100 + 10;
      for (let r = startNum; r <= endNum; r++) {
        rooms.push(`${block}${r}`);
      }
    }
    floors[floorName.toString()] = rooms;
  }
  return floors;
}

const BLOCK_ROOMS = BLOCKS.reduce((acc, block) => {
  acc[block] = generateRooms(block);
  return acc;
}, {});

export default function BookHall() {
  const navigate = useNavigate();

  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const floorsForBlock = block ? Object.keys(BLOCK_ROOMS[block]) : [];
  const roomsForFloor = block && floor ? BLOCK_ROOMS[block][floor] : [];

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!block || !floor || !room || !date || !time || !purpose) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("psg_user") || "{}");
      const token = localStorage.getItem("psg_token");

      if (!user?.email || !token) {
        setError("You must be logged in to make a booking.");
        setLoading(false);
        return;
      }

      const bookingData = { email: user.email, block, floor, room, date, time, purpose };
      const response = await bookingService.createBooking(bookingData, token);

      if (response.success) {
        setSuccess("Booking successful!");
        setTimeout(() => navigate("/mybookings"), 1000);
      } else {
        setError(response.message || "Booking failed.");
      }

      setBlock("");
      setFloor("");
      setRoom("");
      setDate("");
      setTime("");
      setPurpose("");
    } catch (err) {
      console.error("Booking Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // ===============================================================
  // 🧩 RENDERING
  // ===============================================================
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-8 bg-gradient-to-br from-sky-50 to-indigo-100 gap-10">
      
      {/* ================================
          LEFT SECTION: Animation
         ================================ */}
      <div className="flex-1 flex justify-center items-center">
        <Lottie
          animationData={bookingCalendar}
          loop
          className="w-80 h-80 md:w-[400px] md:h-[400px]"
        />
      </div>

      {/* ================================
          RIGHT SECTION: Booking Form
         ================================ */}
      <div className="flex-[1.2] w-full max-w-lg bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Book a Hall</h2>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the details below to reserve your hall.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Block */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Select Block</label>
            <select
              value={block}
              onChange={(e) => { setBlock(e.target.value); setFloor(""); setRoom(""); }}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="">-- Choose block --</option>
              {BLOCKS.map((b) => (
                <option key={b} value={b}>{b} Block</option>
              ))}
            </select>
          </div>

          {/* Floor */}
          {block && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select Floor</label>
              <select
                value={floor}
                onChange={(e) => { setFloor(e.target.value); setRoom(""); }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value="">-- Choose floor --</option>
                {floorsForBlock.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          )}

          {/* Room */}
          {floor && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select Room</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value="">-- Choose room --</option>
                {roomsForFloor.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Time Slot</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="">-- Choose slot --</option>
              {TIME_SLOTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Purpose / Remarks</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          {/* Messages */}
          {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</div>}
          {success && <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">{success}</div>}

          {/* Submit */}
          <button
            className="w-full py-2 mt-2 font-semibold text-white rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 transition disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
