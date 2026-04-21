import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Timer, Play, Pause, RotateCcw, Coffee, FastForward } from "lucide-react";
import { getFocusData, finishFocusSession } from "../services/api";

export default function FocusTimer() {
  const [seconds, setSeconds] = useState(1500); // 25 min default
  const [running, setRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState("pomodoro"); // pomodoro | shortBreak | longBreak
  const [initialSeconds, setInitialSeconds] = useState(1500);
  
  const [stats, setStats] = useState({
    sessionsToday: 0,
    focusTime: "0h 0m",
    breaksEarned: 0,
    quote: "Focus for 25 minutes, then take a short break ☕"
  });

  // Load stats
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getFocusData();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (running && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (running && seconds === 0) {
      // TIMER FINISHED! 
      setRunning(false);
      handleFinishSession();
    }

    return () => clearInterval(interval);
  }, [running, seconds]);

  const handleFinishSession = async () => {
    try {
      // Notify backend that session is complete
      const result = await finishFocusSession({
        mode: currentMode,
        durationSeconds: initialSeconds,
      });

      // Update local stats gracefully without full reload
      setStats({
        ...stats,
        sessionsToday: result.sessionsToday,
        focusTime: result.focusTime,
        breaksEarned: result.breaksEarned,
      });

      // Alert the user gently
      alert(`Time's up! Great job finishing your ${currentMode === 'pomodoro' ? 'Focus Session' : 'Break'}!`);
    } catch (error) {
      console.log("Failed to save session", error);
    }
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(initialSeconds);
  };

  const setMode = (modeName, time) => {
    setRunning(false);
    setSeconds(time);
    setInitialSeconds(time);
    setCurrentMode(modeName);
  };

  const debugSkipToZero = () => {
    // Hidden util to test the dynamic backend saving logic
    setSeconds(2); // Jump to 2 seconds instead of flat zero to see it trigger organically
    setRunning(true);
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-gray-400">Stay focused and productive</p>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Timer className="text-indigo-400" />
            Focus Timer
          </h1>
        </div>

        <Link
          to="/analytics"
          className="bg-indigo-500 hover:bg-indigo-600 px-5 py-3 rounded-xl font-medium transition text-center"
        >
          View Stats
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-2xl mx-auto bg-[#121a2f] border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden">
        
        {/* Secret Debug Button (Top Right corner) */}
        <button 
          onClick={debugSkipToZero}
          className="absolute top-4 right-4 text-xs text-white/20 hover:text-white/60 flex items-center gap-1 transition"
          title="Debug Skip to End"
        >
          <FastForward size={14}/> Skip
        </button>

        {/* Modes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setMode("pomodoro", 1500)}
            className={`${currentMode === 'pomodoro' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-white/5 hover:bg-white/10'} py-3 rounded-xl font-medium transition`}
          >
            Pomodoro
          </button>

          <button
            onClick={() => setMode("shortBreak", 300)}
            className={`${currentMode === 'shortBreak' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-white/5 hover:bg-white/10'} py-3 rounded-xl font-medium transition`}
          >
            Short Break
          </button>

          <button
            onClick={() => setMode("longBreak", 900)}
            className={`${currentMode === 'longBreak' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-white/5 hover:bg-white/10'} py-3 rounded-xl font-medium transition`}
          >
            Long Break
          </button>
        </div>

        {/* Timer Circle */}
        <div className="w-64 h-64 mx-auto rounded-full border-[10px] border-indigo-500 flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20">
          <h2 className="text-5xl font-bold tracking-wider">
            {formatTime()}
          </h2>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setRunning(true)}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition"
          >
            <Play size={18} />
            Start
          </button>

          <button
            onClick={() => setRunning(false)}
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition"
          >
            <Pause size={18} />
            Pause
          </button>

          <button
            onClick={resetTimer}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

        {/* Quote */}
        <div className="bg-white/5 rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-2">
            Productivity Tip
          </p>
          <h3 className="font-semibold">
            {stats.quote}
          </h3>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Sessions Today</p>
          <h3 className="text-2xl font-bold mt-2">{stats.sessionsToday}</h3>
        </div>

        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Focus Time</p>
          <h3 className="text-2xl font-bold mt-2">{stats.focusTime}</h3>
        </div>

        <div className="bg-[#121a2f] border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Break Earned</p>
          <h3 className="text-2xl font-bold mt-2 flex items-center gap-2">
            {stats.breaksEarned} <Coffee size={18} className="text-indigo-400" />
          </h3>
        </div>
      </div>
    </div>
  );
}