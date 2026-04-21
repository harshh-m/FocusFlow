import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Moon, Bell, User, Lock, Save, Palette, Phone } from "lucide-react";
import axios from "axios";

export default function SettingsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key, value) => {
    setData({ ...data, [key]: value });
    if (key === "darkMode") {
      document.body.classList.toggle("light-mode", !value);
    }
  };

  const saveSettings = async () => {
    try {
      const payload = { ...data };
      if (password && password === confirmPassword) {
        payload.password = password;
      }
      
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:5000/api/settings", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local storage explicitly just in case Dark Mode flip is immediate
      setData(res.data);
      
      // Update global user identity in localStorage so Navbar updates smoothly
      const oldUserStr = localStorage.getItem("user");
      if (oldUserStr && oldUserStr !== "undefined") {
        const userCache = JSON.parse(oldUserStr);
        userCache.fullName = payload.name;
        userCache.email = payload.email;
        localStorage.setItem("user", JSON.stringify(userCache));
        // Tell Navbar to catch the new name immediately
        window.dispatchEvent(new Event("userUpdated"));
      }

      alert("Settings Updated! Any changes are strictly saved to your profile.");
      
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading || !data) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-gray-400">Customize your experience</p>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="text-indigo-400" /> Settings
          </h1>
        </div>
        <Link to="/" className="bg-indigo-500 hover:bg-indigo-600 px-5 py-3 rounded-xl font-medium transition">
          Back Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-5">
            <User size={18} /> Profile
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={data.name || ''}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={data.email || ''}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
            />
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                placeholder="Phone Number for Alerts"
                value={data.phone || ''}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-5">
            <Palette size={18} /> Preferences
          </h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><Bell size={16} /> Notifications</span>
              <button
                onClick={() => updateField("notifications", !data.notifications)}
                className={`w-14 h-8 rounded-full transition ${data.notifications ? "bg-indigo-500" : "bg-gray-500"}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full mt-1 transition ${data.notifications ? "ml-7" : "ml-1"}`} />
              </button>
            </div>
            
            <button className="w-full bg-indigo-500/20 text-indigo-400 font-medium py-3 rounded-xl border border-indigo-500/50 cursor-default">
              Theme: Indigo (Active)
            </button>
          </div>        </div>

        {/* Security */}
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-5">
            <Lock size={18} /> Security
          </h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
            />
          </div>
        </div>

        {/* Save */}
        <div className="bg-indigo-500 rounded-2xl p-6 flex flex-col justify-center">
          <p className="text-sm opacity-80">Save Changes</p>
          <h3 className="font-semibold mt-1 mb-5">Keep your productivity setup updated</h3>
          <button onClick={saveSettings} className="bg-white text-black font-medium px-5 py-3 rounded-xl flex items-center gap-2 w-fit">
            <Save size={18} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}