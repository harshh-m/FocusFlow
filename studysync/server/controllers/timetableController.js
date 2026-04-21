import Timetable from "../models/Timetable.js";

// GET ALL FOR USER
export const getTasks = async (req, res) => {
  try {
    const tasks = await Timetable.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch timetable tasks" });
  }
};

// ADD TASK
export const addTask = async (req, res) => {
  try {
    const { subject, time = "", type } = req.body;
    const newTask = await Timetable.create({
      userId: req.user.id,
      subject,
      time,
      type,
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Timetable addTask error:", error);
    res.status(500).json({ message: "Failed to add timetable task" });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    // Ensure the task belongs to the user
    await Timetable.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// TOGGLE TASK
export const toggleTask = async (req, res) => {
  try {
    const task = await Timetable.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.done = !task.done;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle task" });
  }
};
