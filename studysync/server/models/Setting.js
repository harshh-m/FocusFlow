import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    phone: String,
    darkMode: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: "Indigo" },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Setting", settingSchema);