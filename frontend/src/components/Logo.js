import React from "react";
import { useNavigate } from "react-router-dom";

const Logo = ({ size = "md" }) => {
  const navigate = useNavigate();
  const scale = size === "lg" ? 1.4 : size === "sm" ? 0.8 : 1;

  return (
    <div
      onClick={() => navigate("/")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    >
      {/* Logo Mark */}
      <div style={{
        position: "relative",
        width: "42px",
        height: "42px",
      }}>
        {/* Outer glow ring */}
        <div style={{
          position: "absolute",
          inset: "-4px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #2874f0, #ff9900, #26a541)",
          opacity: 0.3,
          filter: "blur(4px)",
          animation: "logoGlow 3s ease-in-out infinite",
        }} />

        {/* Main logo box */}
        <div style={{
          position: "relative",
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #2874f0 0%, #1a4faa 50%, #ff9900 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(40,116,240,0.5), 0 2px 6px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}>
          {/* Shine effect */}
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            width: "60%", height: "50%",
            background: "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 100%)",
            borderRadius: "12px 0 0 0",
          }} />

          {/* Inner design */}
          <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{
              color: "#fff",
              fontWeight: "900",
              fontSize: "18px",
              fontFamily: "Georgia, serif",
              lineHeight: 1,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}>
              P
            </div>
            <div style={{
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "16px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
              borderRadius: "1px",
            }} />
          </div>

          {/* Corner accent */}
          <div style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#ff9900",
            boxShadow: "0 0 6px #ff9900",
          }} />
        </div>
      </div>

      {/* Logo Text */}
      <div style={{ lineHeight: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1px" }}>
          <span style={{
            fontWeight: "900",
            fontSize: "1.3rem",
            color: "var(--text-primary)",
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.5px",
          }}>
            Prep
          </span>
          <span style={{
            fontWeight: "900",
            fontSize: "1.3rem",
            background: "linear-gradient(135deg, #2874f0, #ff9900)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.5px",
          }}>
            AI
          </span>
        </div>
        <div style={{
          fontSize: "0.55rem",
          color: "var(--text-muted)",
          fontWeight: "600",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginTop: "2px",
        }}>
          Interview Prep
        </div>
      </div>

      <style>{`
        @keyframes logoGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default Logo;