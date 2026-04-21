import React, { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [studyHours, setStudyHours] = useState(0);
  const [theme, setTheme] = useState("dark");

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
        reminders,
        setReminders,
        studyHours,
        setStudyHours,
        theme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}