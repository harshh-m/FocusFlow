// server/routes/reminderRoutes.js

import { Router } from "express";

import {
  getReminders,
  addReminder,
  deleteReminder,
} from "../controllers/reminderController.js";

const router = Router();

router.get(
  "/",
  getReminders
);

router.post(
  "/",
  addReminder
);

router.delete(
  "/:id",
  deleteReminder
);

export default router;