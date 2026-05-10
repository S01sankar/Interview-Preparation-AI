import React from "react";

const difficultyColor = (level) => {
  if (level === "Beginner") return { color: "var(--score-high)", bg: "var(--success-bg)", border: "var(--success-border)" };
  if (level === "Intermediate") return { color: "var(--score-mid)", bg: "var(--warning-bg)", border: "var(--warning-border)" };
  return { color: "var(--brand-primary)", bg: "rgba(40,116,240,0.08)", border: "rgba(40,116,240,0.2)" };
};

const ProjectIdeas = ({ projects, weakArea }) => {
  if (!projects || projects.length === 0) return null;

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
        background: "linear-gradient(90deg, transparent, #ff9900, #2874f0, transparent)",
      }} />

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "10px",
      }}>
        <h3 style={{
          color: "var(--text-primary)",
          fontWeight: "700",
          fontSize: "1rem",
          margin: 0,
        }}>
          💡 Project Ideas to Improve Your Skills
        </h3>
        {weakArea && (
          <span className="badge-orange">
            Targets: {weakArea}
          </span>
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "14px",
      }}>
        {projects.map((project, i) => {
          const diff = difficultyColor(project.difficulty);
          return (
            <div key={i} className="card-hover" style={{
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "12px",
              padding: "18px",
              border: "1px solid var(--border-color)",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "10px",
              }}>
                <span style={{ fontSize: "1.5rem" }}>
                  {["🛠️", "🚀", "💻"][i]}
                </span>
                <span style={{
                  backgroundColor: diff.bg,
                  color: diff.color,
                  border: `1px solid ${diff.border}`,
                  padding: "3px 8px",
                  borderRadius: "20px",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                }}>
                  {project.difficulty}
                </span>
              </div>

              <h4 style={{
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "0.9rem",
                margin: "0 0 6px",
              }}>
                {project.name}
              </h4>

              <p style={{
                color: "var(--text-secondary)",
                fontSize: "0.82rem",
                lineHeight: "1.5",
                margin: "0 0 12px",
              }}>
                {project.description}
              </p>

              {/* Tech Stack */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "10px",
              }}>
                {(project.techStack || []).map((tech, j) => (
                  <span key={j} className="badge-blue" style={{
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              {project.timeline && (
                <p style={{
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  margin: 0,
                  fontWeight: "600",
                }}>
                  ⏱️ {project.timeline}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectIdeas;