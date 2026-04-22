import React from "react";

import {
  HashRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AppProvider from "./components/context/AppContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/dashboard";
import Timetable from "./pages/timetable";
import FocusTimer from "./pages/FocusTimer";
import Analytics from "./pages/Analytics";
import Reminders from "./pages/Reminders";
import Settings from "./pages/Setting";
import SignIn from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";


import axios from "axios";

/* Layout */
function Layout() {
  const location = useLocation();

  React.useEffect(() => {
    const fetchTheme = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/settings", {
            headers: { Authorization: `Bearer ${token}` }
          });
          document.body.classList.toggle("light-mode", !res.data.darkMode);
        } catch (error) {
          console.log("Failed to load theme prefs");
        }
      }
    };
    fetchTheme();
  }, [location.pathname]);

  const hideNavbar =
    location.pathname === "/signin" ||
    location.pathname === "/register";

  return (
    <div className="flex bg-[#0b1020] min-h-screen">
      {!hideNavbar && (
        <Navbar />
      )}

      <main className="flex-1 w-full min-w-0 p-4 pt-16 md:p-6 md:pt-6 lg:p-8 lg:pt-8">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/signin"
            element={
              <SignIn />
            }
          />

          <Route
            path="/register"
            element={
              <Register />
            }
          />
          <Route
            path="/verify-email"
            element={
              <VerifyEmail />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timetable"
            element={
              <ProtectedRoute>
                <Timetable />
              </ProtectedRoute>
            }
          />

          <Route
            path="/focus-timer"
            element={
              <ProtectedRoute>
                <FocusTimer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <Reminders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout />
      </HashRouter>
    </AppProvider>
  );
}