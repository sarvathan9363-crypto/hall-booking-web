// 📁 src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./index.css";

// ===============================
// 🚀 React Router v7 Future-Ready Setup
// ===============================

// Create router configuration
const router = createBrowserRouter(
  [
    {
      path: "/*", // Matches all nested routes defined in App.jsx
      element: <App />,
    },
  ],
  {
    // 🧠 Enable React Router v7 features early
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

// ===============================
// 🏁 Application Entry Point
// ===============================
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Using RouterProvider (recommended for React Router v6.22+) */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
