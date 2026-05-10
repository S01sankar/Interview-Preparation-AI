import React, { useState } from "react";
import AmbientBackground from "../components/AmbientBackground";
import Navbar from "../components/Navbar";
import API from "../utils/api";

const ProjectExplainer = () => {
  const [form, setForm] = useState({
    projectName: "",
    techStack: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeViva, setActiveViva] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGenerate = async () => {
    if (!form.projectName || !form.techStack) {
      return setError("Project name and tech stack are required");
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await API.post("/project/explain", form);
      setResult(res.data.project);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate explanation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary)",
      position: "relative",
    }}>
      <AmbientBackground />
      <Navbar />

      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "100px 24px 60px",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--brand-primary)",
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: "600",
            marginBottom: "20px",
            border: "1px solid var(--border-color)",
          }}>
            📋 AI Powered
          </div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            color: "var(--text-primary)",
            marginBottom: "12px",
            letterSpacing: "-0.5px",
          }}>
            Project{" "}
            <span className="gradient-text">Explainer</span>
          </h1>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: "1.7",
            maxWidth: "560px",
            margin: "0 auto",
          }}>
            Enter your project details and get a professional explanation
            with architecture, workflow, viva questions and presentation tips
          </p>
        </div>

        {/* Input Card */}
        <div className="glass-card" style={{
          padding: "32px",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Top glow */}
          <div style={{
            position: "absolute",
            top: 0, left: "15%", right: "15%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #2874f0, #ff9900, transparent)",
          }} />

          {/* Project Name */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "var(--text-secondary)",
              fontWeight: "600",
              fontSize: "0.88rem",
            }}>
              Project Name *
            </label>
            <input
              className="glass-input"
              name="projectName"
              placeholder="e.g. PrepAI — Interview Preparation Platform"
              value={form.projectName}
              onChange={handleChange}
            />
          </div>

          {/* Tech Stack */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "var(--text-secondary)",
              fontWeight: "600",
              fontSize: "0.88rem",
            }}>
              Tech Stack *
            </label>
            <input
              className="glass-input"
              name="techStack"
              placeholder="e.g. React, Node.js, MongoDB, OpenAI API"
              value={form.techStack}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "var(--text-secondary)",
              fontWeight: "600",
              fontSize: "0.88rem",
            }}>
              Brief Description (optional)
            </label>
            <textarea
              className="glass-input"
              name="description"
              placeholder="e.g. A platform that helps students practice mock interviews using AI..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: "var(--error-bg)",
              color: "var(--error-text)",
              border: "1px solid var(--error-border)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "16px",
              fontSize: "0.88rem",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "1rem",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "⏳ Generating explanation..."
              : "🤖 Generate Professional Explanation"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="animate-fadeInUp">

            {/* Overview */}
            <div className="glass-card" style={{
              padding: "28px",
              marginBottom: "16px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: 0, left: "15%", right: "15%",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #2874f0, transparent)",
              }} />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}>
                <h3 style={{
                  color: "var(--text-primary)",
                  fontWeight: "700",
                  fontSize: "1rem",
                  margin: 0,
                }}>
                  📌 Project Overview
                </h3>
                <button
                  onClick={() => handleCopy(result.overview)}
                  style={{
                    padding: "5px 12px",
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--brand-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  📋 Copy
                </button>
              </div>
              <p style={{
                color: "var(--text-secondary)",
                lineHeight: "1.8",
                margin: 0,
                fontSize: "0.95rem",
              }}>
                {result.overview}
              </p>
            </div>

            {/* Architecture */}
            <div className="glass-card" style={{
              padding: "28px",
              marginBottom: "16px",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}>
                <h3 style={{
                  color: "var(--text-primary)",
                  fontWeight: "700",
                  fontSize: "1rem",
                  margin: 0,
                }}>
                  🏗️ System Architecture
                </h3>
                <button
                  onClick={() => handleCopy(result.architecture)}
                  style={{
                    padding: "5px 12px",
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--brand-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  📋 Copy
                </button>
              </div>
              <p style={{
                color: "var(--text-secondary)",
                lineHeight: "1.8",
                margin: 0,
                fontSize: "0.95rem",
              }}>
                {result.architecture}
              </p>
            </div>

            {/* Workflow */}
            <div className="glass-card" style={{
              padding: "28px",
              marginBottom: "16px",
            }}>
              <h3 style={{
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "1rem",
                margin: "0 0 16px",
              }}>
                ⚙️ How It Works
              </h3>
              <p style={{
                color: "var(--text-secondary)",
                lineHeight: "1.8",
                margin: 0,
                fontSize: "0.95rem",
              }}>
                {result.workflow}
              </p>
            </div>

            {/* Key Features */}
            <div className="glass-card" style={{
              padding: "28px",
              marginBottom: "16px",
            }}>
              <h3 style={{
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "1rem",
                margin: "0 0 16px",
              }}>
                ✨ Key Features
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}>
                {(result.keyFeatures || []).map((feature, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    backgroundColor: "var(--bg-tertiary)",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid var(--border-color)",
                  }}>
                    <span style={{
                      color: "var(--brand-primary)",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}>
                      {i + 1}.
                    </span>
                    <span style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.88rem",
                      lineHeight: "1.5",
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Explanation */}
            <div className="glass-card" style={{
              padding: "28px",
              marginBottom: "16px",
            }}>
              <h3 style={{
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "1rem",
                margin: "0 0 14px",
              }}>
                🛠️ Why This Tech Stack?
              </h3>
              <p style={{
                color: "var(--text-secondary)",
                lineHeight: "1.8",
                margin: 0,
                fontSize: "0.95rem",
              }}>
                {result.techExplanation}
              </p>
            </div>

            {/* Viva Questions */}
            <div className="glass-card" style={{
              padding: "28px",
              marginBottom: "16px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: 0, left: "15%", right: "15%",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #ff9900, transparent)",
              }} />
              <h3 style={{
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "1rem",
                margin: "0 0 16px",
              }}>
                🎓 Viva Questions & Answers
              </h3>
              {(result.vivaQuestions || []).map((viva, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: "10px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    overflow: "hidden",
                  }}
                >
                  {/* Question */}
                  <div
                    onClick={() =>
                      setActiveViva(activeViva === i ? null : i)
                    }
                    style={{
                      padding: "14px 16px",
                      backgroundColor: activeViva === i
                        ? "var(--bg-tertiary)"
                        : "var(--bg-secondary)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span style={{
                      color: "var(--text-primary)",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}>
                      Q{i + 1}: {viva.question}
                    </span>
                    <span style={{
                      color: "var(--brand-primary)",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}>
                      {activeViva === i ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Answer */}
                  {activeViva === i && (
                    <div style={{
                      padding: "14px 16px",
                      backgroundColor: "var(--bg-tertiary)",
                      borderTop: "1px solid var(--border-color)",
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                    }}>
                      💡 {viva.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Presentation Tips */}
            <div className="glass-card" style={{
              padding: "28px",
              marginBottom: "16px",
            }}>
              <h3 style={{
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "1rem",
                margin: "0 0 16px",
              }}>
                🎤 Presentation Tips
              </h3>
              {(result.presentationTips || []).map((tip, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "10px",
                  padding: "12px",
                  backgroundColor: "var(--bg-tertiary)",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                }}>
                  <span style={{
                    width: "24px",
                    height: "24px",
                    background: "var(--gradient-secondary)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "0.75rem",
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.88rem",
                    lineHeight: "1.6",
                  }}>
                    {tip}
                  </span>
                </div>
              ))}
            </div>

            {/* Try Again */}
            <button
              onClick={() => {
                setResult(null);
                setForm({
                  projectName: "",
                  techStack: "",
                  description: "",
                });
              }}
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "13px",
                fontSize: "0.95rem",
              }}
            >
              🔄 Explain Another Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectExplainer;