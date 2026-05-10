import React, { useState } from "react";
import AmbientBackground from "../components/AmbientBackground";
import Navbar from "../components/Navbar";
import API from "../utils/api";

const EXPERIENCE_LEVELS = [
  "Fresher", "1 year", "2 years",
  "3 years", "5 years", "7+ years",
];

const POPULAR_SKILLS = [
  "React", "Node.js", "Python", "Java",
  "Machine Learning", "AWS", "Docker",
  "MongoDB", "TypeScript", "Flutter",
];

const CareerSimulation = () => {
  const [form, setForm] = useState({
    currentRole: "",
    experience: "Fresher",
    skills: "",
    interests: "",
    targetRole: "",
    location: "India",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSkill = (skill) => {
    const updated = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    setSelectedSkills(updated);
    setForm({ ...form, skills: updated.join(", ") });
  };

  const handleSimulate = async () => {
    if (!form.currentRole || !form.skills) {
      return setError("Current role and skills are required");
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await API.post("/career/simulate", form);
      setResult(res.data.career);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to simulate career"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === "High") return {
      color: "var(--score-low)",
      bg: "var(--error-bg)",
      border: "var(--error-border)",
    };
    if (priority === "Medium") return {
      color: "var(--score-mid)",
      bg: "var(--warning-bg)",
      border: "var(--warning-border)",
    };
    return {
      color: "var(--score-high)",
      bg: "var(--success-bg)",
      border: "var(--success-border)",
    };
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "var(--score-high)";
    if (score >= 50) return "var(--score-mid)";
    return "var(--score-low)";
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
        maxWidth: "960px",
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
            🚀 AI Powered
          </div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            color: "var(--text-primary)",
            marginBottom: "12px",
            letterSpacing: "-0.5px",
          }}>
            Career{" "}
            <span className="gradient-text">Simulation</span>
          </h1>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: "1.7",
            maxWidth: "560px",
            margin: "0 auto",
          }}>
            Enter your profile and get a personalized 5-year career
            roadmap with salary predictions and skill recommendations
          </p>
        </div>

        {/* Input Card */}
        {!result && (
          <div className="glass-card animate-fadeInUp" style={{
            padding: "36px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: 0, left: "15%", right: "15%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #2874f0, #ff9900, transparent)",
            }} />

            {/* Row 1 */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "var(--text-secondary)",
                  fontWeight: "600",
                  fontSize: "0.88rem",
                }}>
                  Current Role *
                </label>
                <input
                  className="glass-input"
                  name="currentRole"
                  placeholder="e.g. Junior Frontend Developer"
                  value={form.currentRole}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "var(--text-secondary)",
                  fontWeight: "600",
                  fontSize: "0.88rem",
                }}>
                  Target Role
                </label>
                <input
                  className="glass-input"
                  name="targetRole"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={form.targetRole}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Experience */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                marginBottom: "10px",
                color: "var(--text-secondary)",
                fontWeight: "600",
                fontSize: "0.88rem",
              }}>
                Experience Level
              </label>
              <div style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}>
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setForm({ ...form, experience: level })
                    }
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      border: `1.5px solid ${
                        form.experience === level
                          ? "var(--brand-primary)"
                          : "var(--border-color)"
                      }`,
                      backgroundColor: form.experience === level
                        ? "var(--bg-tertiary)"
                        : "transparent",
                      color: form.experience === level
                        ? "var(--brand-primary)"
                        : "var(--text-secondary)",
                      cursor: "pointer",
                      fontWeight: form.experience === level ? "700" : "500",
                      fontSize: "0.82rem",
                      transition: "var(--transition-smooth)",
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                marginBottom: "10px",
                color: "var(--text-secondary)",
                fontWeight: "600",
                fontSize: "0.88rem",
              }}>
                Skills * (select or type)
              </label>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "12px",
              }}>
                {POPULAR_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "20px",
                      border: `1.5px solid ${
                        selectedSkills.includes(skill)
                          ? "var(--brand-secondary)"
                          : "var(--border-color)"
                      }`,
                      backgroundColor: selectedSkills.includes(skill)
                        ? "var(--warning-bg)"
                        : "transparent",
                      color: selectedSkills.includes(skill)
                        ? "var(--brand-secondary)"
                        : "var(--text-secondary)",
                      cursor: "pointer",
                      fontWeight: selectedSkills.includes(skill)
                        ? "700"
                        : "500",
                      fontSize: "0.82rem",
                      transition: "var(--transition-smooth)",
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <input
                className="glass-input"
                name="skills"
                placeholder="Or type skills: React, Node.js, Python..."
                value={form.skills}
                onChange={handleChange}
              />
            </div>

            {/* Row 2 */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "24px",
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "var(--text-secondary)",
                  fontWeight: "600",
                  fontSize: "0.88rem",
                }}>
                  Interests
                </label>
                <input
                  className="glass-input"
                  name="interests"
                  placeholder="e.g. AI, Startups, Gaming"
                  value={form.interests}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "var(--text-secondary)",
                  fontWeight: "600",
                  fontSize: "0.88rem",
                }}>
                  Location
                </label>
                <input
                  className="glass-input"
                  name="location"
                  placeholder="e.g. India, USA, Remote"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
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

            {/* Simulate Button */}
            <button
              onClick={handleSimulate}
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
                ? "⏳ Simulating your career..."
                : "🚀 Simulate My Career"}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="animate-fadeInUp">

            {/* Career Score + Summary */}
            <div className="glass-card" style={{
              padding: "32px",
              marginBottom: "20px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: 0, left: "10%", right: "10%",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #2874f0, #ff9900, transparent)",
              }} />

              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "40px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}>
                {/* Career Score */}
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: "4rem",
                    fontWeight: "900",
                    color: getScoreColor(result.careerScore),
                    lineHeight: 1,
                  }}>
                    {result.careerScore}
                  </div>
                  <div style={{
                    color: "var(--text-muted)",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    marginTop: "4px",
                  }}>
                    Career Readiness Score
                  </div>
                </div>

                <div style={{
                  width: "1px",
                  height: "60px",
                  backgroundColor: "var(--border-color)",
                }} />

                {/* Current Salary */}
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: "1.4rem",
                    fontWeight: "800",
                    color: "var(--brand-secondary)",
                    lineHeight: 1,
                  }}>
                    {result.currentSalary}
                  </div>
                  <div style={{
                    color: "var(--text-muted)",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    marginTop: "4px",
                  }}>
                    Current Salary Range
                  </div>
                </div>

                <div style={{
                  width: "1px",
                  height: "60px",
                  backgroundColor: "var(--border-color)",
                }} />

                {/* Dream Role */}
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: "1rem",
                    fontWeight: "800",
                    color: "var(--brand-primary)",
                    lineHeight: 1.3,
                  }}>
                    {result.dreamRolePrediction?.role}
                  </div>
                  <div style={{
                    color: "var(--text-muted)",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    marginTop: "4px",
                  }}>
                    Dream Role in {result.dreamRolePrediction?.timeframe}
                  </div>
                </div>
              </div>

              <p style={{
                color: "var(--text-secondary)",
                lineHeight: "1.7",
                fontSize: "0.95rem",
                maxWidth: "600px",
                margin: "0 auto",
              }}>
                {result.summary}
              </p>
            </div>

            {/* Career Roadmap */}
            <div className="glass-card" style={{
              padding: "28px",
              marginBottom: "20px",
            }}>
              <h3 style={{
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "1rem",
                margin: "0 0 24px",
              }}>
                🗺️ 5-Year Career Roadmap
              </h3>

              <div style={{ position: "relative" }}>
                {/* Timeline line */}
                <div style={{
                  position: "absolute",
                  left: "20px",
                  top: "0",
                  bottom: "0",
                  width: "2px",
                  background: "linear-gradient(180deg, #2874f0, #ff9900)",
                  borderRadius: "1px",
                }} />

                {(result.roadmap || []).map((step, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "20px",
                    paddingLeft: "52px",
                    position: "relative",
                  }}>
                    {/* Circle */}
                    <div style={{
                      position: "absolute",
                      left: "10px",
                      top: "12px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: i === 0
                        ? "var(--gradient-primary)"
                        : i === result.roadmap.length - 1
                        ? "var(--gradient-secondary)"
                        : "var(--glass-bg)",
                      border: "2px solid var(--brand-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }} />

                    {/* Content */}
                    <div className="card-hover" style={{
                      flex: 1,
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "14px",
                      padding: "18px 20px",
                      border: "1px solid var(--border-color)",
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}>
                        <div>
                          <span className="badge-blue" style={{
                            marginRight: "8px",
                            fontSize: "0.72rem",
                          }}>
                            {step.year}
                          </span>
                          <span style={{
                            color: "var(--text-primary)",
                            fontWeight: "700",
                            fontSize: "0.95rem",
                          }}>
                            {step.role}
                          </span>
                        </div>
                        <div style={{
                          textAlign: "right",
                        }}>
                          <div style={{
                            color: "var(--brand-secondary)",
                            fontWeight: "700",
                            fontSize: "0.88rem",
                          }}>
                            {step.salary}
                          </div>
                          <div style={{
                            color: getScoreColor(step.probability),
                            fontSize: "0.75rem",
                            fontWeight: "600",
                          }}>
                            {step.probability}% likely
                          </div>
                        </div>
                      </div>

                      <p style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.85rem",
                        margin: "0 0 10px",
                        lineHeight: "1.5",
                      }}>
                        🎯 {step.milestone}
                      </p>

                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}>
                        {(step.skills || []).map((skill, j) => (
                          <span key={j} className="badge-orange" style={{
                            fontSize: "0.72rem",
                            padding: "2px 8px",
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills to Learn */}
            <div className="glass-card" style={{
              padding: "28px",
              marginBottom: "20px",
            }}>
              <h3 style={{
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "1rem",
                margin: "0 0 16px",
              }}>
                📚 Top Skills to Learn
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
              }}>
                {(result.topSkillsToLearn || []).map((item, i) => {
                  const colors = getPriorityColor(item.priority);
                  return (
                    <div key={i} className="card-hover" style={{
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "12px",
                      padding: "16px",
                      border: "1px solid var(--border-color)",
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}>
                        <span style={{
                          color: "var(--text-primary)",
                          fontWeight: "700",
                          fontSize: "0.9rem",
                        }}>
                          {item.skill}
                        </span>
                        <span style={{
                          backgroundColor: colors.bg,
                          color: colors.color,
                          border: `1px solid ${colors.border}`,
                          padding: "2px 8px",
                          borderRadius: "20px",
                          fontSize: "0.7rem",
                          fontWeight: "700",
                        }}>
                          {item.priority}
                        </span>
                      </div>
                      <p style={{
                        color: "var(--text-muted)",
                        fontSize: "0.78rem",
                        margin: 0,
                        lineHeight: "1.5",
                      }}>
                        {item.reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Industry Trends + Risk Factors */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "20px",
            }}>
              {/* Trends */}
              <div className="glass-card" style={{ padding: "24px" }}>
                <h3 style={{
                  color: "var(--text-primary)",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  margin: "0 0 14px",
                }}>
                  📈 Industry Trends
                </h3>
                {(result.industryTrends || []).map((trend, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor: "var(--bg-tertiary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                  }}>
                    <span style={{ color: "var(--brand-primary)" }}>
                      →
                    </span>
                    <span style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      lineHeight: "1.5",
                    }}>
                      {trend}
                    </span>
                  </div>
                ))}
              </div>

              {/* Risk Factors */}
              <div className="glass-card" style={{ padding: "24px" }}>
                <h3 style={{
                  color: "var(--text-primary)",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  margin: "0 0 14px",
                }}>
                  ⚠️ Risk Factors
                </h3>
                {(result.riskFactors || []).map((risk, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor: "var(--error-bg)",
                    borderRadius: "8px",
                    border: "1px solid var(--error-border)",
                  }}>
                    <span style={{ color: "var(--score-low)" }}>!</span>
                    <span style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      lineHeight: "1.5",
                    }}>
                      {risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dream Role */}
            {result.dreamRolePrediction && (
              <div className="glass-card" style={{
                padding: "28px",
                marginBottom: "20px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute",
                  top: 0, left: "10%", right: "10%",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #ff9900, transparent)",
                }} />
                <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
                  🌟
                </div>
                <h3 style={{
                  color: "var(--text-primary)",
                  fontWeight: "800",
                  fontSize: "1.2rem",
                  marginBottom: "6px",
                }}>
                  Dream Role Prediction
                </h3>
                <p style={{
                  color: "var(--brand-primary)",
                  fontWeight: "800",
                  fontSize: "1.4rem",
                  margin: "0 0 8px",
                }}>
                  {result.dreamRolePrediction.role}
                </p>
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  flexWrap: "wrap",
                }}>
                  <span className="badge-orange">
                    ⏱️ {result.dreamRolePrediction.timeframe}
                  </span>
                  <span className="badge-blue">
                    💰 {result.dreamRolePrediction.salary}
                  </span>
                  <span className="badge-green">
                    ✅ {result.dreamRolePrediction.probability}% probability
                  </span>
                </div>
              </div>
            )}

            {/* Try Again */}
            <button
              onClick={() => {
                setResult(null);
                setForm({
                  currentRole: "",
                  experience: "Fresher",
                  skills: "",
                  interests: "",
                  targetRole: "",
                  location: "India",
                });
                setSelectedSkills([]);
              }}
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "13px",
                fontSize: "0.95rem",
              }}
            >
              🔄 Simulate Another Career
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerSimulation;