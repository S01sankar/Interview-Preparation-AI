import React, { useEffect, useState } from "react";

const AuraScore = ({ score, label }) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getAuraColor = (s) => {
    if (s >= 8) return {
      primary: "#26a541",
      secondary: "#4caf50",
      glow: "rgba(38,165,65,0.4)",
      label: "Magnetic Aura 🌟",
      desc: "You have a powerful interview presence!",
    };
    if (s >= 6) return {
      primary: "#2874f0",
      secondary: "#4d90fe",
      glow: "rgba(40,116,240,0.4)",
      label: "Strong Aura 💪",
      desc: "Your presence is confident and professional.",
    };
    if (s >= 4) return {
      primary: "#ff9900",
      secondary: "#ffb347",
      glow: "rgba(255,153,0,0.4)",
      label: "Growing Aura 📈",
      desc: "Your presence is developing well.",
    };
    return {
      primary: "#cc0000",
      secondary: "#ff6161",
      glow: "rgba(204,0,0,0.3)",
      label: "Weak Aura 🔧",
      desc: "Focus on confidence and clarity.",
    };
  };

  const aura = getAuraColor(score);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (animated / 10) * circumference;

  return (
    <div style={{
      textAlign: "center",
      padding: "28px",
    }}>
      {/* Aura Ring */}
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Outer glow rings */}
        <div style={{
          position: "absolute",
          inset: "-12px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${aura.glow} 0%, transparent 70%)`,
          animation: "pulseAura 2s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "50%",
          border: `2px solid ${aura.primary}30`,
          animation: "pulseAura 2s ease-in-out infinite 0.5s",
        }} />

        <svg width="140" height="140">
          {/* Background circle */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke={`url(#auraGradient)`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "70px 70px",
              transition: "stroke-dashoffset 1.5s ease",
              filter: `drop-shadow(0 0 8px ${aura.glow})`,
            }}
          />
          <defs>
            <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={aura.primary} />
              <stop offset="100%" stopColor={aura.secondary} />
            </linearGradient>
          </defs>

          {/* Center text */}
          <text
            x="70" y="62"
            textAnchor="middle"
            fill={aura.primary}
            fontSize="28"
            fontWeight="900"
            fontFamily="Segoe UI"
          >
            {score}
          </text>
          <text
            x="70" y="80"
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="12"
            fontFamily="Segoe UI"
          >
            /10
          </text>
        </svg>
      </div>

      <h3 style={{
        color: aura.primary,
        fontWeight: "800",
        fontSize: "1.1rem",
        margin: "16px 0 6px",
      }}>
        {aura.label}
      </h3>
      <p style={{
        color: "var(--text-secondary)",
        fontSize: "0.88rem",
        margin: 0,
      }}>
        {aura.desc}
      </p>

      <style>{`
        @keyframes pulseAura {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default AuraScore;