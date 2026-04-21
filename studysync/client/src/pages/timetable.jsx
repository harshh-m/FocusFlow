import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Plus,
  Clock3,
  BookOpen,
  Trash2,
} from "lucide-react";
import {
  getTimetable,
  addTimetableTask,
  deleteTimetableTask,
} from "../services/api";

export default function Timetable() {
  const [tasks, setTasks] = useState([]);
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Study");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTimetable();
      setTasks(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!subject || !time) return;

    try {
      const newTask = await addTimetableTask({
        subject,
        time,
        type,
      });

      setTasks([...tasks, newTask]);

      setSubject("");
      setTime("");
      setType("Study");
    } catch (error) {
      console.log("Failed to add task", error);
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTimetableTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log("Failed to remove task", error);
    }
  };

  const handleExport = () => {
    if (tasks.length === 0) {
      alert("There are no tasks to export!");
      return;
    }

    // Generate CSV content
    const headers = "Subject,Time,Type\n";
    const rows = tasks.map(t => `"${t.subject}","${t.time}","${t.type}"`).join("\n");
    const csvContent = headers + rows;

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "FocusFlow_Timetable.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-gray-400">Manage your daily schedule</p>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalendarDays className="text-indigo-400" />
            Timetable
          </h1>
        </div>

        <button 
          onClick={handleExport}
          className="bg-indigo-500 hover:bg-indigo-600 px-5 py-3 rounded-xl font-medium transition"
        >
          Export Plan
        </button>
      </div>

      {/* Add Task */}
      <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-5 mb-8">
        <h2 className="text-xl font-semibold mb-5">Add New Study Slot</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Subject Name"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
          >
            <option className="bg-[#121a2f]">Study</option>
            <option className="bg-[#121a2f]">Coding</option>
            <option className="bg-[#121a2f]">Notes</option>
            <option className="bg-[#121a2f]">Exam</option>
          </select>

          <button
            onClick={addTask}
            className="bg-indigo-500 hover:bg-indigo-600 rounded-xl flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            Add Slot
          </button>
        </div>
      </div>

      {/* Schedule Cards */}
      {loading ? (
        <div className="text-center text-gray-400">Loading timetable...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-gray-400 bg-[#121a2f] rounded-2xl p-8">
          No tasks added yet
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-[#121a2f] border border-white/10 rounded-2xl p-5 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-500/20 p-3 rounded-xl">
                  <BookOpen className="text-indigo-400" size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{task.subject}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                    <Clock3 size={14} />
                    {task.time}
                  </p>
                  <span className="text-xs text-indigo-400">{task.type}</span>
                </div>
              </div>

              <button
                onClick={() => removeTask(task._id)}
                className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}