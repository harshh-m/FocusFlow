// server/models/Reminder.js

import mongoose from "mongoose";

const reminderSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      time: {
        type: String,
        required: true,
      },

      date: {
        type: String,
        default: "Today",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Reminder",
  reminderSchema
);