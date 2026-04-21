import Focus from "../models/Focus.js";

// GET FOCUS DATA
export const getFocusData = async (req, res) => {
  try {
    const userId = req.user.id;
    let focus = await Focus.findOne({ userId });

    if (!focus) {
      focus = await Focus.create({ userId });
    }

    res.json({
      sessionsToday: focus.sessionsToday,
      focusTime: `${Math.floor(focus.focusTime / 60)}h ${focus.focusTime % 60}m`,
      breaksEarned: focus.breaksEarned,
      quote: "Focus for 25 minutes, then take a short break ☕",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// FINISH SESSION
export const finishFocusSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mode, durationSeconds } = req.body;

    let focus = await Focus.findOne({ userId });
    if (!focus) return res.status(404).json({ message: "Focus data not found" });

    // Duration is in seconds.
    const durationMinutes = Math.round(durationSeconds / 60);

    if (mode === "pomodoro") {
      focus.sessionsToday += 1;
      focus.focusTime += durationMinutes;
      focus.breaksEarned += 1;
    } else {
      // It was a break
      if (focus.breaksEarned > 0) {
        focus.breaksEarned -= 1;
      }
    }

    await focus.save();

    res.json({
      sessionsToday: focus.sessionsToday,
      focusTime: `${Math.floor(focus.focusTime / 60)}h ${focus.focusTime % 60}m`,
      breaksEarned: focus.breaksEarned,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};