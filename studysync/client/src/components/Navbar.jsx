// Replace full Navbar.jsx with this responsive aligned version

import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Home,
  CalendarDays,
  Timer,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const location =
    useLocation();

  const navigate =
    useNavigate();

  useEffect(() => {
    const loadUserFromStorage = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      }
    };
    
    // Load immediately on mount
    loadUserFromStorage();

    // Re-load if settings are updated
    window.addEventListener("userUpdated", loadUserFromStorage);
    return () => window.removeEventListener("userUpdated", loadUserFromStorage);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const links = [
    {
      to: "/",
      label: "Dashboard",
      icon: <Home size={18} />,
    },
    {
      to: "/timetable",
      label: "Timetable",
      icon: <CalendarDays size={18} />,
    },
    {
      to: "/focus-timer",
      label: "Focus Timer",
      icon: <Timer size={18} />,
    },
    {
      to: "/analytics",
      label: "Analytics",
      icon: <BarChart3 size={18} />,
    },
    {
      to: "/reminders",
      label: "Reminders",
      icon: <Bell size={18} />,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: <Settings size={18} />,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() =>
          setOpen(true)
        }
        className="lg:hidden fixed top-4 right-4 z-50 bg-[#121a2f] p-2 rounded-xl text-white"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() =>
            setOpen(false)
          }
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen shrink-0 w-64 bg-[#121a2f] text-white p-5 flex flex-col transition-all duration-300
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-indigo-400">
            FocusFlow
          </h1>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="space-y-2">
          {links.map(
            (item, i) => {
              const active =
                location.pathname ===
                item.to;

              return (
                <Link
                  key={i}
                  to={item.to}
                  onClick={() =>
                    setOpen(false)
                  }
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
                  ${
                    active
                      ? "bg-indigo-500 text-white"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            }
          )}
        </nav>

        {/* Bottom */}
        <div className="mt-auto">
          {user && (
            <div className="bg-white/5 rounded-2xl p-4 mb-4">
              <div className="flex gap-3 items-center">
                <User size={18} />

                <div>
                  <p className="text-xs text-gray-400">
                    Logged in as
                  </p>

                  <h3 className="font-semibold text-sm">
                    {
                      user.fullName
                    }
                  </h3>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}