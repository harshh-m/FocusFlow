import Setting from "../models/Setting.js";
import User from "../models/User.js";
import { sendMockNotification } from "../services/notificationService.js";

// GET SETTINGS
export const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    let data = await Setting.findOne({ userId });
    const user = await User.findById(userId);

    if (!data) {
      data = await Setting.create({
        userId,
        name: user ? user.fullName : "Student",
        email: user ? user.email : "student@email.com",
        phone: "",
        darkMode: true,
        notifications: true,
        theme: "Indigo",
      });
    } else if (data.name === "Student" && user) {
      // Auto-heal the early test bug where it saved "Student" into the DB for an existing user 
      data.name = user.fullName;
      data.email = user.email;
      await data.save();
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

// UPDATE SETTINGS
export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const oldData = await Setting.findOne({ userId });
    
    const data = await Setting.findOneAndUpdate(
      { userId },
      req.body,
      { new: true, upsert: true }
    );

    // Sync settings identity to root User database
    if (data.name || data.email) {
      await User.findByIdAndUpdate(userId, { 
        fullName: data.name, 
        email: data.email 
      });
    }

    if (oldData && oldData.notifications === false && data.notifications === true) {
      sendMockNotification(data.email, data.phone, "welcome_email");
      sendMockNotification(data.email, data.phone, "welcome_sms");
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};