import mongoose from "mongoose";

const focusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionsToday: {
      type: Number,
      default: 0,
    },
    focusTime: {
      type: Number,
      default: 0,
    },
    breaksEarned: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Focus", focusSchema);
