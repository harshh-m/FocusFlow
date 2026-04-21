// src/Reminders.jsx

import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  Bell,
  Plus,
  Trash2,
  Clock3,
  CalendarDays,
} from "lucide-react";

import axios from "axios";

export default function Reminders() {
  const [reminders, setReminders] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [time, setTime] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  /* Fetch Reminders */
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders =
    async () => {
      try {
        const res =
          await axios.get(
            "http://localhost:5000/api/reminders"
          );

        setReminders(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  /* Add Reminder */
  const addReminder =
    async () => {
      if (
        !title.trim() ||
        !time
      )
        return;

      try {
        const res =
          await axios.post(
            "http://localhost:5000/api/reminders",
            {
              title:
                title.trim(),
              time,
              date: "Today",
            }
          );

        setReminders(
          [
            res.data,
            ...reminders,
          ]
        );

        setTitle("");
        setTime("");
      } catch (error) {
        console.log(error);
      }
    };

  /* Delete Reminder */
  const deleteReminder =
    async (id) => {
      try {
        await axios.delete(
          `http://localhost:5000/api/reminders/${id}`
        );

        setReminders(
          reminders.filter(
            (item) =>
              item._id !== id
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-gray-400">
            Never miss a task
          </p>

          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="text-indigo-400" />
            Reminders
          </h1>
        </div>

        <Link
          to="/"
          className="bg-indigo-500 hover:bg-indigo-600 px-5 py-3 rounded-xl font-medium transition"
        >
          Back Dashboard
        </Link>
      </div>

      {/* Add Reminder */}
      <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-5">
          Add New Reminder
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Reminder Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
          />

          <input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(
                e.target.value
              )
            }
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
          />

          <button
            onClick={
              addReminder
            }
            className="bg-indigo-500 hover:bg-indigo-600 rounded-xl flex items-center justify-center gap-2 font-medium py-3"
          >
            <Plus size={18} />
            Add Reminder
          </button>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="text-center text-gray-400">
          Loading reminders...
        </div>
      ) : reminders.length ===
        0 ? (
        <div className="text-center text-gray-400 bg-[#121a2f] rounded-2xl p-8">
          No reminders found
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {reminders.map(
            (item) => (
              <div
                key={
                  item._id
                }
                className="bg-[#121a2f] border border-white/10 rounded-2xl p-5 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-500/20 p-3 rounded-xl">
                    <Bell
                      className="text-indigo-400"
                      size={
                        18
                      }
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      {
                        item.title
                      }
                    </h3>

                    <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                      <Clock3
                        size={
                          14
                        }
                      />
                      {
                        item.time
                      }
                    </p>

                    <span className="text-xs text-indigo-400 flex items-center gap-1 mt-1">
                      <CalendarDays
                        size={
                          12
                        }
                      />
                      {
                        item.date
                      }
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    deleteReminder(
                      item._id
                    )
                  }
                  className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg"
                >
                  <Trash2
                    size={
                      18
                    }
                  />
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Bottom */}
      <div className="mt-8 bg-indigo-500 rounded-2xl p-6">
        <p className="text-sm opacity-80">
          Reminder Tip
        </p>

        <h3 className="font-semibold mt-1">
          Set reminders before exams and revision slots 📚
        </h3>
      </div>
    </div>
  );
}