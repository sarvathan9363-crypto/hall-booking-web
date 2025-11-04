// ===============================================================
// 📁 src/api/bookingsService.js
// Centralized API handler for authentication and booking requests
// ===============================================================

// ✅ Backend API Base URL (from .env or defaults to localhost)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ===============================================================
// 🔒 Utility: Get Auth Header (reads token from localStorage)
// ===============================================================
function getAuthHeader() {
  const token = localStorage.getItem("psg_token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

// ===============================================================
// 🧩 AUTHENTICATION ENDPOINTS
// ===============================================================

// ✅ Signup new user
export async function signupUser(userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to signup");
    return data;
  } catch (err) {
    console.error("Signup Error:", err);
    throw err;
  }
}

// ✅ Login existing user
export async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid credentials");

    // ✅ Save token and user info
    if (data.token) localStorage.setItem("psg_token", data.token);
    if (data.user) localStorage.setItem("psg_user", JSON.stringify(data.user));

    return data;
  } catch (err) {
    console.error("Login Error:", err);
    throw err;
  }
}

// ===============================================================
// 🧩 BOOKING ENDPOINTS
// ===============================================================

// ✅ Create a new booking (email auto-filled by backend via JWT)
export async function createBooking(bookingData) {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create booking");

    return data;
  } catch (err) {
    console.error("Create Booking Error:", err);
    throw err;
  }
}

// ✅ Fetch all bookings (for admin or general view)
export async function fetchAllBookings() {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");
    return data;
  } catch (err) {
    console.error("Fetch All Bookings Error:", err);
    throw err;
  }
}

// ✅ Fetch bookings of the logged-in user only
export async function fetchMyBookings() {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Failed to fetch user bookings");

    return data;
  } catch (err) {
    console.error("Fetch My Bookings Error:", err);
    throw err;
  }
}

// ✅ Cancel a booking (Protected route)
export async function cancelBooking(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/cancel/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to cancel booking");
    return data;
  } catch (err) {
    console.error("Cancel Booking Error:", err);
    throw err;
  }
}

// ✅ Delete a booking (Protected route)
export async function deleteBooking(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete booking");
    return data;
  } catch (err) {
    console.error("Delete Booking Error:", err);
    throw err;
  }
}

// ✅ Find bookings by date and time slot
export async function findByDateAndSlot(date, slot) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/bookings?date=${encodeURIComponent(
        date
      )}&slot=${encodeURIComponent(slot)}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Failed to fetch bookings by date/slot");

    return data;
  } catch (err) {
    console.error("FindByDateAndSlot Error:", err);
    throw err;
  }
}

// ===============================================================
// 🧩 BACKWARD COMPATIBILITY + DEFAULT EXPORT
// ===============================================================
export const getAllBookings = fetchAllBookings;

const bookingService = {
  signupUser,
  loginUser,
  createBooking,
  fetchAllBookings,
  fetchMyBookings,
  cancelBooking,
  deleteBooking,
  findByDateAndSlot,
};

export default bookingService;
export const BASE_URL = API_BASE_URL;
