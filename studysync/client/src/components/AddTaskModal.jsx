import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddTaskModal({ isOpen, onClose, onAddTask }) {
  const [subject, setSubject] = useState("");
  const [isStudyRelated, setIsStudyRelated] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!subject.trim()) {
      setError("Task name is required");
      return;
    }

    setLoading(true);
    try {
      await onAddTask({
        subject: subject.trim(),
        type: isStudyRelated ? "study" : "personal",
      });

      // Reset form
      setSubject("");
      setIsStudyRelated(true);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121a2f] rounded-2xl p-6 w-full max-w-md text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Task Name</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics Assignment"
              className="w-full bg-[#0b1020] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Task Type Toggle */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Task Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsStudyRelated(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  isStudyRelated
                    ? "bg-indigo-500 text-white"
                    : "bg-[#0b1020] text-gray-400 border border-gray-600 hover:border-indigo-500"
                }`}
              >
                📚 Study
              </button>
              <button
                type="button"
                onClick={() => setIsStudyRelated(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  !isStudyRelated
                    ? "bg-indigo-500 text-white"
                    : "bg-[#0b1020] text-gray-400 border border-gray-600 hover:border-indigo-500"
                }`}
              >
                ✓ Personal
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg bg-[#0b1020] text-white hover:bg-gray-900 transition border border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 transition font-medium"
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
