import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setSessionCount((prev) => prev + 1);
            return 25 * 60; // reset for next session
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Music */}
      <audio autoPlay loop volume="0.5">
        <source src="https://cdn.pixabay.com/download/audio/2023/03/02/audio_89e1b929c3.mp3?filename=calm-soft-music-141163.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-6 h-6 bg-white opacity-10 rounded-full animate-float blur-xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></span>
        ))}
      </div>

      {/* Timer UI */}
      <div className="bg-white bg-opacity-10 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 text-center">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Pomodoro Timer 🍅</h1>
        <div className="text-6xl font-mono mb-4 text-cyan-300 glow">{formatTime(timeLeft)}</div>
        <div className="space-x-4">
          <Button
            onClick={startTimer}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 transition rounded-full shadow hover:scale-105"
          >
            Start
          </Button>
          <Button
            onClick={pauseTimer}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 transition rounded-full shadow hover:scale-105"
          >
            Pause
          </Button>
          <Button
            onClick={resetTimer}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 transition rounded-full shadow hover:scale-105"
          >
            Reset
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-300">Sessions Completed: {sessionCount}</p>
      </div>

      {/* Bubbles animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
        .glow {
          text-shadow: 0 0 8px rgba(0, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default PomodoroTimer;
