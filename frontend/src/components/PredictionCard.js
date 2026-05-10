import React from "react";

const PredictionCard = ({ prediction }) => {
  if (!prediction) return null;

  const { successProbability, riskLevel, strengths, risks, suggestions } = prediction;

  const getRiskColor = (level) => {
    if (level === "Low") return { color: "var(--score-high)", bg: "var(--success-bg)", border: "var(--success-border)" };
    if (level === "Medium") return { color: "var(--score-mid)", bg: "var(--warning-bg)", border: "var(--warning-border)" };
    return { color: "var(--score-low)", bg: "var(--error-bg)", border: "var(--error-border)" };
  };

  const riskColors = getRiskColor(riskLevel);

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
        background: "linear-gradient(90deg, transparent, #26a541, #2874f0, transparent)",
      }} />

      <h3 style={{
        color: "var(--text-primary)",
        fontWeight: "700",
        fontSize: "1rem",
        margin: "0 0 20px",
      }}>
        🔮 Interview Success Prediction
      </h3>

      {/* Success Probability */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "20px",
        backgroundColor: "var(--bg-tertiary)",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid var(--border-color)",
      }}>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{
            fontSize: "3rem",
            fontWeight: "900",
            color: successProbability >= 70
              ? "var(--score-high)"
              : successProbability >= 50
              ? "var(--score-mid)"
              : "var(--score-low)",
            lineHeight: 1,
          }}>
            {successProbability}%
          </div>
          <div style={{
            color: "var(--text-muted)",
            fontSize: "0.75rem",
            fontWeight: "600",
            marginTop: "4px",
          }}>
            Success Probability
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            height: "10px",
            backgroundColor: "var(--border-color)",
            borderRadius: "5px",
            overflow: "hidden",
            marginBottom: "8px",
          }}>
            <div style={{
              height: "100%",
              width: `${successProbability}%`,
              background: successProbability >= 70
                ? "linear-gradient(90deg, #26a541, #4caf50)"
                : successProbability >= 50
                ? "linear-gradient(90deg, #ff9900, #ffb347)"
                : "linear-gradient(90deg, #cc0000, #ff6161)",
              borderRadius: "5px",
              transition: "width 1.5s ease",
            }} />
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Risk Level */}
        <div style={{
          backgroundColor: riskColors.bg,
          border: `1px solid ${riskColors.border}`,
          borderRadius: "10px",
          padding: "10px 16px",
          textAlign: "center",
          flexShrink: 0,
        }}>
          <div style={{
            color: riskColors.color,
            fontWeight: "800",
            fontSize: "0.95rem",
          }}>
            {riskLevel} Risk
          </div>
        </div>
      </div>

      {/* Strengths */}
      {strengths && strengths.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <p style={{
            color: "var(--score-high)",
            fontWeight: "700",
            fontSize: "0.82rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: "0 0 8px",
          }}>
            ✅ Strengths
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {strengths.map((s, i) => (
              <span key={i} className="badge-green">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {risks && risks.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <p style={{
            color: "var(--score-low)",
            fontWeight: "700",
            fontSize: "0.82rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: "0 0 8px",
          }}>
            ⚠️ Areas of Risk
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {risks.map((r, i) => (
              <span key={i} style={{
                backgroundColor: "var(--error-bg)",
                color: "var(--score-low)",
                border: "1px solid var(--error-border)",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.78rem",
                fontWeight: "700",
              }}>
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div>
          <p style={{
            color: "var(--brand-primary)",
            fontWeight: "700",
            fontSize: "0.82rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: "0 0 8px",
          }}>
            💡 Improvement Suggestions
          </p>
          {suggestions.map((s, i) => (
            <div key={i} style={{
              display: "flex",
              gap: "10px",
              marginBottom: "8px",
              fontSize: "0.88rem",
              color: "var(--text-secondary)",
            }}>
              <span style={{ color: "var(--brand-primary)", flexShrink: 0 }}>
                {i + 1}.
              </span>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionCard;