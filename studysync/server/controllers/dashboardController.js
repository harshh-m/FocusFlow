import Dashboard from "../models/Dashboard.js";
import Timetable from "../models/Timetable.js";

export const getDashboard =
  async (req, res) => {
    try {
      const userId = req.user.id;

      let dashboard = await Dashboard.findOne({ userId });
      const timetableTasks = await Timetable.find({ userId }).sort({createdAt: 1}).limit(5);

      if (!dashboard) {
        dashboard =
          await Dashboard.create({
            userId,
            studyHours: 0,
            streak: 0,
            tasksDone: 0,
            totalTasks: 0,
            focusScore: 0,
            quote:
              "Start small. Stay consistent.",
          });
      }

      res.json({
        user:
          req.user.id,
        stats: [
          {
            title:
              "Study Hours",
            value:
              dashboard.studyHours +
              "h",
            sub: "Today",
          },
          {
            title:
              "Streak",
            value:
              dashboard.streak,
            sub: "Days",
          },
          {
            title:
              "Tasks",
            value:
              dashboard.tasksDone +
              "/" +
              dashboard.totalTasks,
            sub: "Done",
          },
          {
            title:
              "Focus Score",
            value:
              dashboard.focusScore +
              "%",
            sub:
              "Performance",
          },
        ],
        tasks: Array.isArray(timetableTasks) ? timetableTasks.map((t) => ({
          _id: t._id,
          subject: t.subject,
          time: t.time,
          type: t.type,
          done: t.done || false
        })) : [],
        exams: [],
        quote: dashboard.quote,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };