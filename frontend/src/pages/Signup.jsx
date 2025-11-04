// ===============================================================
// 📁 src/pages/Signup.jsx
// PSG Hall Booking Portal — Create Account (Futuristic UI)
// ===============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/bookingsService";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    rollno: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // ✅ Handle form field updates
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trimStart(),
    });
  };

  // ✅ Submit form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await signupUser(formData);

      if (response.message && response.message.includes("exists")) {
        setMessage("⚠️ User already exists! Try logging in instead.");
        setIsError(true);
      } else {
        setMessage("✅ Signup successful! Redirecting to login...");
        setFormData({ name: "", rollno: "", email: "", password: "" });
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      console.error("❌ Signup error:", error);
      let errMsg = "❌ Signup failed. Please try again.";
      if (error.message.includes("exists")) {
        errMsg = "⚠️ This user already exists. Please log in instead.";
      } else if (error.message.includes("NetworkError")) {
        errMsg = "⚠️ Unable to connect to server. Check backend connection.";
      }
      setMessage(errMsg);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // ===============================================================
  // 🧩 RENDERING
  // ===============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-transparent to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <h1 className="text-2xl font-bold text-gray-800">
            College of Technology
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Hall Booking Portal — Create Account
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Roll Number
            </label>
            <input
              type="text"
              name="rollno"
              value={formData.rollno}
              onChange={handleChange}
              placeholder="Enter your roll number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@college.edu"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Password with Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-md font-semibold text-white shadow-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {/* Message Box */}
          {message && (
            <p
              className={`mt-3 text-center font-medium ${
                isError ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Redirect to Login */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-blue-600 hover:underline font-medium"
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
