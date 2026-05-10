import React, { useEffect, useState, useRef } from "react";

const Timer = ({ duration = 120, onTimeUp, isRunning }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            onTimeUp && onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / duration) * 100;

  const getColor = () => {
    if (percentage > 50) return {
      text: "var(--score-high)",
      bar: "#22c55e",
      glow: "rgba(34,197,94,0.3)",
    };
    if (percentage > 25) return {
      text: "var(--score-mid)",
      bar: "#eab308",
      glow: "rgba(234,179,8,0.3)",
    };
    return {
      text: "var(--score-low)",
      bar: "#ef4444",
      glow: "rgba(239,68,68,0.3)",
    };
  };

  const colors = getColor();

  // Circle progress
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "20px",
    }}>
      {/* Circle */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
          {/* Background circle */}
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="5"
          />
          {/* Progress circle */}
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke={colors.bar}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
              filter: `drop-shadow(0 0 6px ${colors.glow})`,
            }}
          />
        </svg>
        {/* Time text inside circle */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}>
          <span style={{
            fontSize: "0.95rem",
            fontWeight: "800",
            color: colors.text,
            fontFamily: "monospace",
            lineHeight: 1,
          }}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Text info */}
      <div style={{ flex: 1 }}>
        <p style={{
          color: "var(--text-primary)",
          fontWeight: "700",
          fontSize: "0.95rem",
          margin: "0 0 6px",
        }}>
          {isRunning
            ? timeLeft > 0
              ? "Recording in progress..."
              : "Time's up!"
            : "Ready to record"}
        </p>

        {/* Linear progress bar */}
        <div style={{
          height: "6px",
          backgroundColor: "var(--border-color)",
          borderRadius: "3px",
          overflow: "hidden",
          marginBottom: "6px",
        }}>
          <div style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: colors.bar,
            borderRadius: "3px",
            transition: "width 1s linear",
            boxShadow: `0 0 8px ${colors.glow}`,
          }} />
        </div>

        <p style={{
          color: "var(--text-muted)",
          fontSize: "0.78rem",
          margin: 0,
        }}>
          {timeLeft > 0
            ? `${timeLeft} seconds remaining`
            : "Recording stopped automatically"}
        </p>
      </div>
    </div>
  );
};

export default Timer;