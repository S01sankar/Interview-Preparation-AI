import React from "react";

const traits = {
  leadership: { icon: "👑", color: "#2874f0", label: "Leadership" },
  analytical:  { icon: "🧠", color: "#26a541", label: "Analytical" },
  emotional:   { icon: "💎", color: "#9c27b0", label: "Emotional IQ" },
  confidence:  { icon: "🦁", color: "#ff9900", label: "Confidence" },
  creativity:  { icon: "🎨", color: "#00bcd4", label: "Creativity" },
};

const PersonalityCard = ({ personality }) => {
  if (!personality) return null;

  return (
    <div className="glass-card" style={{
      padding: "24px",
      marginBottom: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top glow */}
      <div style={{
        position: "absolute",
        top: 0, left: "10%", right: "10%",
        height: "2px",
        background: "linear-gradient(90deg, transparent, #2874f0, #ff9900, transparent)",
      }} />

      <h3 style={{
        color: "var(--text-primary)",
        fontWeight: "700",
        fontSize: "1rem",
        margin: "0 0 20px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        🪞 Personality Mirror
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "12px",
        marginBottom: "20px",
      }}>
        {Object.entries(personality.traits || {}).map(([key, value]) => {
          const trait = traits[key];
          if (!trait) return null;
          return (
            <div key={key} style={{
              textAlign: "center",
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "12px",
              padding: "14px 8px",
              border: "1px solid var(--border-color)",
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>
                {trait.icon}
              </div>
              <div style={{
                fontSize: "1.2rem",
                fontWeight: "800",
                color: trait.color,
                marginBottom: "4px",
              }}>
                {value}/10
              </div>
              <div style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                fontWeight: "600",
              }}>
                {trait.label}
              </div>
              {/* Mini bar */}
              <div style={{
                height: "4px",
                backgroundColor: "var(--border-color)",
                borderRadius: "2px",
                marginTop: "8px",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${(value / 10) * 100}%`,
                  backgroundColor: trait.color,
                  borderRadius: "2px",
                  transition: "width 1s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dominant Trait */}
      {personality.dominantTrait && (
        <div style={{
          backgroundColor: "var(--bg-tertiary)",
          borderRadius: "10px",
          padding: "14px 16px",
          border: "1px solid var(--border-color)",
          marginBottom: "12px",
        }}>
          <p style={{
            color: "var(--brand-primary)",
            fontWeight: "700",
            fontSize: "0.82rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: "0 0 4px",
          }}>
            Dominant Trait
          </p>
          <p style={{
            color: "var(--text-primary)",
            fontWeight: "600",
            margin: 0,
            fontSize: "0.92rem",
          }}>
            {personality.dominantTrait}
          </p>
        </div>
      )}

      {/* Summary */}
      {personality.summary && (
        <div style={{
          backgroundColor: "var(--bg-secondary)",
          borderLeft: "3px solid var(--brand-primary)",
          borderRadius: "0 10px 10px 0",
          padding: "12px 16px",
          fontSize: "0.88rem",
          color: "var(--text-secondary)",
          lineHeight: "1.6",
        }}>
          🧬 {personality.summary}
        </div>
      )}
    </div>
  );
};

export default PersonalityCard;