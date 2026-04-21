import Analytics from "../models/Analytics.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    let analytics = await Analytics.findOne({ userId });

    if (!analytics) {
      analytics = await Analytics.create({
        userId,
        totalHours: 0,
        streak: 0,
        tasksCompleted: 0,
        goalSuccess: 0,
        weeklyData: [
          { day: "Mon", hours: 0 },
          { day: "Tue", hours: 0 },
          { day: "Wed", hours: 0 },
          { day: "Thu", hours: 0 },
          { day: "Fri", hours: 0 },
          { day: "Sat", hours: 0 },
          { day: "Sun", hours: 0 },
        ],
        subjects: [],
        insights: ["Start logging study sessions to see insights!"],
        growth: "+0% Productivity This Month",
      });
    }

    res.json({
      cards: [
        {
          title: "Total Hours",
          value: analytics.totalHours + "h",
        },
        {
          title: "Current Streak",
          value: analytics.streak + " Days",
        },
        {
          title: "Tasks Completed",
          value: analytics.tasksCompleted,
        },
        {
          title: "Goal Success",
          value: analytics.goalSuccess + "%",
        },
      ],
      weeklyData: analytics.weeklyData,
      subjects: analytics.subjects,
      insights: analytics.insights,
      growth: analytics.growth,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};