import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Flame,
  BookOpen,
  Brain,
  Clock3,
  Plus,
  Trash2,
  Check,
} from "lucide-react";

import {
  getDashboardData,
  addTimetableTask,
  deleteTimetableTask,
  toggleTimetableTask,
} from "../services/api";

import AddTaskModal from "../components/AddTaskModal";

export default function Dashboard() {
  const [data, setData] =
    useState(null);

  const [user, setUser] =
    useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskCompletion, setTaskCompletion] = useState({});

  useEffect(() => {
    loadDashboard();

    const savedUser =
      localStorage.getItem(
        "user"
      );

    if (
      savedUser &&
      savedUser !==
      "undefined"
    ) {
      setUser(
        JSON.parse(
          savedUser
        )
      );
    }
  }, []);

  const loadDashboard =
    async () => {
      try {
        const res =
          await getDashboardData();

        setData(res);

        // Initialize task completion state
        const completion = {};
        res.tasks.forEach((task) => {
          completion[task._id] = task.done || false;
        });
        setTaskCompletion(completion);
      } catch (error) {
        console.log(error);
      }
    };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await addTimetableTask(taskData);
      // Reload dashboard to get updated tasks
      await loadDashboard();
    } catch (error) {
      console.error("Failed to add task:", error);
      throw error;
    }
  };

  const handleToggleTask = async (taskId) => {
    // Optimistic UI update
    setTaskCompletion((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));

    try {
      await toggleTimetableTask(taskId);
      // Reload dashboard to sync database state quietly
      await loadDashboard();
    } catch (error) {
      console.error("Failed to toggle task:", error);
      // Revert on failure
      setTaskCompletion((prev) => ({
        ...prev,
        [taskId]: !prev[taskId],
      }));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        console.log("Deleting task:", taskId);
        await deleteTimetableTask(taskId);
        console.log("Task deleted successfully");
        await loadDashboard();
      } catch (error) {
        console.error("Failed to delete task:", error);
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  if (!data)
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );

  const icons = [
    <Clock3 size={18} />,
    <Flame size={18} />,
    <BookOpen size={18} />,
    <Brain size={18} />,
  ];

  return (
    <div className="min-h-full w-full max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-400">
          Welcome back 👋
        </p>

        <h1 className="text-4xl font-bold mt-2">
          {user
            ? user.fullName
            : data.user}
          , stay focused today
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {data.stats.map(
          (item, i) => (
            <div
              key={i}
              className="bg-[#121a2f] p-5 rounded-2xl"
            >
              <div className="flex justify-between mb-4">
                <span>
                  {item.title}
                </span>

                <span className="text-indigo-400">
                  {icons[i]}
                </span>
              </div>

              <h2 className="text-2xl font-bold">
                {item.value}
              </h2>

              <p className="text-sm text-gray-400">
                {item.sub}
              </p>
            </div>
          )
        )}
      </div>

      {/* Tasks + Exams */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="xl:col-span-2 bg-[#121a2f] p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">
              Today's Tasks
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-500 hover:bg-indigo-600 p-2 rounded-xl text-white transition"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {data.tasks.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No tasks scheduled for today. Click the + to add some!</p>
            ) : (
              data.tasks.map((task, i) => (
                <div
                  key={i}
                  className={`bg-white/5 p-4 rounded-xl flex justify-between items-center transition ${taskCompletion[task._id]
                      ? "opacity-60 border border-green-500/30"
                      : "border border-gray-600/30"
                    }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={taskCompletion[task._id] || false}
                      onChange={() => handleToggleTask(task._id)}
                      className="w-5 h-5 rounded cursor-pointer accent-green-500"
                    />
                    <div className="flex-1">
                      <p
                        className={`${taskCompletion[task._id]
                            ? "line-through text-gray-500"
                            : ""
                          }`}
                      >
                        {task.subject}
                      </p>
                      <div className="flex gap-2 items-center text-sm text-gray-400">
                        {task.time && <span>{task.time}</span>}
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                          {task.type === "study" ? "📚 Study" : "✓ Personal"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {taskCompletion[task._id] && (
                      <Check size={20} className="text-green-500" />
                    )}
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Exams */}
        <div className="bg-[#121a2f] p-5 rounded-2xl">
          <h2 className="text-xl font-bold mb-5">
            Upcoming Exams
          </h2>

          <div className="space-y-4">
            {data.exams.map(
              (exam, i) => (
                <div
                  key={i}
                  className="bg-white/5 p-4 rounded-xl"
                >
                  <p>
                    {exam.name}
                  </p>

                  <span className="text-indigo-400 text-sm">
                    {exam.left}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="mt-6 bg-indigo-500 p-5 rounded-2xl">
            <p className="text-sm opacity-80">
              Motivation
            </p>

            <h3 className="font-semibold mt-2">
              {data.quote}
            </h3>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}