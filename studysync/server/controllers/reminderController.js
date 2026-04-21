// server/controllers/reminderController.js

import Reminder from "../models/Reminder.js";

/* GET ALL */
export const getReminders =
  async (req, res) => {
    try {
      const reminders =
        await Reminder.find().sort({
          createdAt: -1,
        });

      res.json(reminders);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch reminders",
      });
    }
  };

/* ADD */
export const addReminder =
  async (req, res) => {
    try {
      const {
        title,
        time,
        date,
      } = req.body;

      const newReminder =
        await Reminder.create({
          title,
          time,
          date,
        });

      res.status(201).json(
        newReminder
      );
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to add reminder",
      });
    }
  };

/* DELETE */
export const deleteReminder =
  async (req, res) => {
    try {
      await Reminder.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Reminder deleted",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to delete reminder",
      });
    }
  };