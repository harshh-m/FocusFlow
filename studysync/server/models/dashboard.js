import mongoose from "mongoose";

const dashboardSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      studyHours: {
        type: Number,
        default: 0,
      },

      streak: {
        type: Number,
        default: 0,
      },

      tasksDone: {
        type: Number,
        default: 0,
      },

      totalTasks: {
        type: Number,
        default: 0,
      },

      focusScore: {
        type: Number,
        default: 0,
      },

      quote: {
        type: String,
        default:
          "Start small. Stay consistent.",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Dashboard",
  dashboardSchema
);