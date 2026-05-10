import React from "react";

const PressureMeter = ({ level, scores }) => {
  const avgScore = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 10;

  const getPressureData = () => {
    if (avgScore >= 7.5) return {
      label: "Low Pressure",
      emoji: "😊",
      color: "var(--score-high)",
      bg: "var(--success-bg)",
      border: "var(--success-border)",
      bar: "#22c55e",
      percentage: 25,
      tip: "You are doing great! Keep it up.",
    };
    if (avgScore >= 5.5) return {
      label: "Medium Pressure",
      emoji: "😤",
      color: "var(--score-mid)",
      bg: "var(--warning-bg)",
      border: "var(--warning-border)",
      bar: "#eab308",
      percentage: 60,
      tip: "Interviewer is getting tougher. Stay focused!",
    };
    return {
      label: "High Pressure",
      emoji: "🔥",
      color: "var(--score-low)",
      bg: "var(--error-bg)",
      border: "var(--error-border)",
      bar: "#ef4444",
      percentage: 95,
      tip: "Maximum pressure! Think carefully before answering.",
    };
  };

  const data = getPressureData();

  return (
    <div style={{
      backgroundColor: data.bg,
      border: `1px solid ${data.border}`,
      borderRadius: "12px",
      padding: "14px 18px",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    }}>
      {/* Emoji */}
      <div style={{ fontSize: "1.8rem", flexShrink: 0 }}>
        {data.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
        }}>
          <span style={{
            color: data.color,
            fontWeight: "700",
            fontSize: "0.88rem",
          }}>
            {data.label}
          </span>
          <span style={{
            color: data.color,
            fontWeight: "700",
            fontSize: "0.82rem",
          }}>
            {data.percentage}%
          </span>
        </div>

        {/* Pressure Bar */}
        <div style={{
          height: "6px",
          backgroundColor: "var(--border-color)",
          borderRadius: "3px",
          overflow: "hidden",
          marginBottom: "6px",
        }}>
          <div style={{
            height: "100%",
            width: `${data.percentage}%`,
            backgroundColor: data.bar,
            borderRadius: "3px",
            transition: "width 1s ease",
            boxShadow: `0 0 8px ${data.bar}80`,
          }} />
        </div>

        <p style={{
          color: data.color,
          fontSize: "0.78rem",
          margin: 0,
          fontWeight: "500",
        }}>
          {data.tip}
        </p>
      </div>
    </div>
  );
};

export default PressureMeter;