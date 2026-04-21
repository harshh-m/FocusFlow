import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    goalSuccess: {
      type: Number,
      default: 0,
    },
    weeklyData: [
      {
        day: String,
        hours: Number,
      },
    ],
    subjects: [
      {
        subject: String,
        value: String,
      },
    ],
    insights: [
      {
        type: String,
      },
    ],
    growth: {
      type: String,
      default: "+0% Productivity This Month",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Analytics", analyticsSchema);
