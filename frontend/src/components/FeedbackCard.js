import React from "react";

const ScoreBadge = ({ label, value, icon }) => {
  const getColors = (score) => {
    if (score >= 8) return {
      bg: "var(--success-bg)",
      text: "var(--score-high)",
      border: "var(--success-border)",
      bar: "#22c55e",
    };
    if (score >= 6) return {
      bg: "var(--warning-bg)",
      text: "var(--score-mid)",
      border: "var(--warning-border)",
      bar: "#eab308",
    };
    return {
      bg: "var(--error-bg)",
      text: "var(--score-low)",
      border: "var(--error-border)",
      bar: "#ef4444",
    };
  };

  const colors = getColors(value);

  return (
    <div style={{
      backgroundColor: "var(--bg-tertiary)",
      borderRadius: "12px",
      padding: "14px 16px",
      marginBottom: "10px",
      border: "1px solid var(--border-color)",
      transition: "var(--transition-smooth)",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
      }}>
        <span style={{
          color: "var(--text-secondary)",
          fontSize: "0.88rem",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          {icon} {label}
        </span>
        <span style={{
          backgroundColor: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          fontWeight: "800",
          fontSize: "0.88rem",
          padding: "3px 10px",
          borderRadius: "20px",
        }}>
          {value}/10
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: "6px",
        backgroundColor: "var(--border-color)",
        borderRadius: "3px",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${(value / 10) * 100}%`,
          backgroundColor: colors.bar,
          borderRadius: "3px",
          transition: "width 0.8s ease",
        }} />
      </div>
    </div>
  );
};

const FeedbackCard = ({
  question,
  transcript,
  scores,
  overall,
  feedback,
  index,
}) => {
  const getOverallColor = (score) => {
    if (score >= 8) return "var(--score-high)";
    if (score >= 6) return "var(--score-mid)";
    return "var(--score-low)";
  };

  const getOverallBg = (score) => {
    if (score >= 8) return "var(--success-bg)";
    if (score >= 6) return "var(--warning-bg)";
    return "var(--error-bg)";
  };

  const getOverallBorder = (score) => {
    if (score >= 8) return "var(--success-border)";
    if (score >= 6) return "var(--warning-border)";
    return "var(--error-border)";
  };

  const getOverallLabel = (score) => {
    if (score >= 9) return "Excellent 🌟";
    if (score >= 8) return "Great 💪";
    if (score >= 7) return "Good 👍";
    if (score >= 6) return "Average 📈";
    if (score >= 5) return "Below Average ⚠️";
    return "Needs Work 🔧";
  };

  const dimensionIcons = {
    technical: "🔧",
    clarity: "💬",
    relevance: "🎯",
    structure: "📋",
  };

  return (
    <div
      className="glass-card glow-border animate-fadeInUp"
      style={{
        padding: "24px",
        marginBottom: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top glow line */}
      <div style={{
        position: "absolute",
        top: 0, left: "15%", right: "15%",
        height: "2px",
        background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
      }} />

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "16px",
        gap: "12px",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--brand-primary)",
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "700",
            marginBottom: "8px",
            border: "1px solid var(--border-color)",
          }}>
            Question {index + 1}
          </div>
          <p style={{
            color: "var(--text-primary)",
            fontWeight: "600",
            fontSize: "0.95rem",
            margin: 0,
            lineHeight: "1.5",
          }}>
            {question}
          </p>
        </div>

        {/* Overall Score Badge */}
        <div style={{
          textAlign: "center",
          backgroundColor: getOverallBg(overall),
          border: `1px solid ${getOverallBorder(overall)}`,
          borderRadius: "14px",
          padding: "10px 16px",
          flexShrink: 0,
        }}>
          <div style={{
            fontSize: "1.6rem",
            fontWeight: "900",
            color: getOverallColor(overall),
            lineHeight: 1,
          }}>
            {overall}
          </div>
          <div style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            marginTop: "3px",
            fontWeight: "600",
          }}>
            /10
          </div>
          <div style={{
            fontSize: "0.72rem",
            color: getOverallColor(overall),
            fontWeight: "700",
            marginTop: "4px",
            whiteSpace: "nowrap",
          }}>
            {getOverallLabel(overall)}
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div style={{
        backgroundColor: "var(--bg-secondary)",
        borderRadius: "12px",
        padding: "14px",
        marginBottom: "16px",
        border: "1px solid var(--border-color)",
      }}>
        <p style={{
          color: "var(--text-muted)",
          fontSize: "0.75rem",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          margin: "0 0 6px",
        }}>
          Your Answer
        </p>
        <p style={{
          color: "var(--text-secondary)",
          fontSize: "0.88rem",
          lineHeight: "1.6",
          margin: 0,
        }}>
          {transcript}
        </p>
      </div>

      {/* Score Dimensions */}
      {Object.entries(scores).map(([key, value]) => (
        <ScoreBadge
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          icon={dimensionIcons[key] || "📊"}
        />
      ))}

      {/* Feedback */}
      <div style={{
        backgroundColor: "var(--bg-tertiary)",
        borderLeft: "3px solid var(--brand-primary)",
        borderRadius: "0 12px 12px 0",
        padding: "14px 16px",
        marginTop: "14px",
        border: "1px solid var(--border-color)",
      }}>
        <p style={{
          color: "var(--brand-primary)",
          fontSize: "0.75rem",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          margin: "0 0 6px",
        }}>
          💡 AI Feedback
        </p>
        <p style={{
          color: "var(--text-secondary)",
          fontSize: "0.88rem",
          lineHeight: "1.6",
          margin: 0,
        }}>
          {feedback}
        </p>
      </div>
    </div>
  );
};

export default FeedbackCard;