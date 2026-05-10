import React, { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    // Check saved preference
    const saved = localStorage.getItem("prepai_theme");
    if (saved) {
      setIsDark(saved === "dark");
      applyTheme(saved === "dark");
    }
  }, []);

  const applyTheme = (dark) => {
    const root = document.documentElement;
    if (dark) {
      root.style.setProperty("--bg-primary", "#080c18");
      root.style.setProperty("--bg-secondary", "#0d1224");
      root.style.setProperty("--bg-tertiary", "#111830");
      root.style.setProperty("--text-primary", "#ffffff");
      root.style.setProperty("--text-secondary", "#cccccc");
      root.style.setProperty("--text-muted", "#888888");
      root.style.setProperty("--glass-bg", "rgba(13,18,36,0.8)");
      root.style.setProperty("--glass-border", "rgba(40,116,240,0.25)");
      root.style.setProperty("--glass-shadow", "0 8px 40px rgba(0,0,0,0.6)");
      root.style.setProperty("--border-color", "rgba(40,116,240,0.2)");
      root.style.setProperty("--border-strong", "rgba(40,116,240,0.35)");
      root.style.setProperty("--nav-bg", "rgba(8,12,24,0.92)");
      root.style.setProperty("--nav-border", "rgba(40,116,240,0.15)");
      root.style.setProperty("--input-bg", "rgba(13,18,36,0.95)");
      root.style.setProperty("--input-border", "rgba(40,116,240,0.25)");
      root.style.setProperty("--score-high", "#4caf50");
      root.style.setProperty("--score-mid", "#ffb347");
      root.style.setProperty("--score-low", "#ff6161");
      root.style.setProperty("--success-bg", "rgba(38,165,65,0.12)");
      root.style.setProperty("--success-text", "#4caf50");
      root.style.setProperty("--success-border", "rgba(76,175,80,0.25)");
      root.style.setProperty("--error-bg", "rgba(204,0,0,0.12)");
      root.style.setProperty("--error-text", "#ff6161");
      root.style.setProperty("--error-border", "rgba(255,97,97,0.25)");
      root.style.setProperty("--warning-bg", "rgba(255,153,0,0.12)");
      root.style.setProperty("--warning-text", "#ffb347");
      root.style.setProperty("--warning-border", "rgba(255,179,71,0.25)");
      document.body.style.background = "linear-gradient(160deg, #080c18 0%, #0d1224 30%, #0f1a12 70%, #180c08 100%)";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      root.style.setProperty("--bg-primary", "#eef2ff");
      root.style.setProperty("--bg-secondary", "#ffffff");
      root.style.setProperty("--bg-tertiary", "#e4ecff");
      root.style.setProperty("--text-primary", "#212121");
      root.style.setProperty("--text-secondary", "#555555");
      root.style.setProperty("--text-muted", "#878787");
      root.style.setProperty("--glass-bg", "rgba(255,255,255,0.75)");
      root.style.setProperty("--glass-border", "rgba(40,116,240,0.18)");
      root.style.setProperty("--glass-shadow", "0 8px 32px rgba(40,116,240,0.12)");
      root.style.setProperty("--border-color", "rgba(40,116,240,0.12)");
      root.style.setProperty("--border-strong", "rgba(40,116,240,0.25)");
      root.style.setProperty("--nav-bg", "rgba(255,255,255,0.95)");
      root.style.setProperty("--nav-border", "rgba(40,116,240,0.1)");
      root.style.setProperty("--input-bg", "#ffffff");
      root.style.setProperty("--input-border", "rgba(40,116,240,0.2)");
      root.style.setProperty("--score-high", "#26a541");
      root.style.setProperty("--score-mid", "#e47911");
      root.style.setProperty("--score-low", "#cc0000");
      root.style.setProperty("--success-bg", "#e8f5e9");
      root.style.setProperty("--success-text", "#26a541");
      root.style.setProperty("--success-border", "rgba(38,165,65,0.25)");
      root.style.setProperty("--error-bg", "#fff0f0");
      root.style.setProperty("--error-text", "#cc0000");
      root.style.setProperty("--error-border", "rgba(204,0,0,0.2)");
      root.style.setProperty("--warning-bg", "#fff8e7");
      root.style.setProperty("--warning-text", "#e47911");
      root.style.setProperty("--warning-border", "rgba(228,121,17,0.25)");
      document.body.style.background = "linear-gradient(160deg, #eef2ff 0%, #f0f4ff 30%, #fff8f0 70%, #f0fff4 100%)";
      document.body.style.backgroundAttachment = "fixed";
    }
  };

  const toggle = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    localStorage.setItem("prepai_theme", newVal ? "dark" : "light");
    applyTheme(newVal);
  };

  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--glass-bg)",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "var(--transition-smooth)",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Sun / Moon */}
      <div style={{
        fontSize: "1.1rem",
        transition: "transform 0.4s ease, opacity 0.3s ease",
        transform: isDark ? "rotate(0deg)" : "rotate(180deg)",
      }}>
        {isDark ? "☀️" : "🌙"}
      </div>
    </button>
  );
};

export default ThemeToggle;