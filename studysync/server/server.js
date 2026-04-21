import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

/* Routes */
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import focusRoutes from "./routes/focusRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";

dotenv.config();

const app =
  express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Database */
connectDB();

/* API Routes */
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/focus",
  focusRoutes
);

app.use(
  "/api/reminders",
  reminderRoutes
);

app.use(
  "/api/settings",
  settingRoutes
);

app.use(
  "/api/timetable",
  timetableRoutes
);

/* Test Route */
app.get("/", (req, res) => {
  res.send(
    "FocusFlow Backend Running 🚀"
  );
});

/* Server Start */
app.listen(5000, () =>
  console.log(
    "Server Running on Port 5000 🚀"
  )
);