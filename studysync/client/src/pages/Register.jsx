// src/pages/Register.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
} from "lucide-react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res =
        await registerUser({
          fullName:
            formData.fullName,
          email:
            formData.email,
          password:
            formData.password,
        });

      if (res.token) {
        localStorage.setItem(
          "token",
          res.token
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.user
        )
      );

      alert(
        "Account created successfully! Welcome to StudySync."
      );

      navigate("/");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Registration Failed";
      console.log(error);
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-[#121a2f]">
        <div className="max-w-md">
          <div className="bg-indigo-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen
              className="text-indigo-400"
              size={30}
            />
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Join
            <span className="text-indigo-400">
              {" "}
              StudySync
            </span>
          </h1>

          <p className="text-gray-400 mt-5 text-lg">
            Build habits, track progress,
            manage your study life smarter.
          </p>

          <div className="mt-10 bg-white/5 rounded-2xl p-5 border border-white/10">
            <p className="text-sm text-gray-300">
              “The future depends on what you do today.”
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md bg-[#121a2f] border border-white/10 rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-2">
            Create Account
          </h2>

          <p className="text-gray-400 mb-8">
            Start your productivity journey
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Full Name
              </label>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4">
                <User
                  size={18}
                  className="text-gray-400"
                />

                <input
                  type="text"
                  name="fullName"
                  placeholder="John Mark"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Email Address
              </label>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4">
                <Mail
                  size={18}
                  className="text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="you@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Password
              </label>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4">
                <Lock
                  size={18}
                  className="text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      className="text-gray-400"
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="text-gray-400"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Confirm Password
              </label>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4">
                <Lock
                  size={18}
                  className="text-gray-400"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-transparent px-3 py-3 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={18}
                      className="text-gray-400"
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="text-gray-400"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-xl font-semibold transition"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-400 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}