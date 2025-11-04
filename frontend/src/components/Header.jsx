import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <header className="w-full bg-gradient-to-r from-sky-700 to-indigo-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* --- Left Section: Title --- */}
        <div>
          <Link
            to="/dashboard"
            className="text-lg font-semibold tracking-wide hover:text-white transition"
          >
            College of Technology
          </Link>
          <div className="text-xs text-white/80">
            Hall Booking Portal
          </div>
        </div>

        {/* --- Right Section: Navigation --- */}
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/book"
                className="text-sm px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                Book Hall
              </Link>
              <Link
                to="/bookings"
                className="text-sm px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                My Bookings
              </Link>

              <div
                className="ml-3 px-3 py-1.5 rounded-md bg-white/10 text-sm font-medium hover:bg-white/20 cursor-pointer transition"
                onClick={() => {
                  onLogout()
                  navigate('/')
                }}
              >
                Logout
              </div>
            </>
          ) : (
            <Link
              to="/"
              className="text-sm px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
