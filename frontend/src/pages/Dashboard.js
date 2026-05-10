import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import { LineChart, RadarChart } from "../components/ScoreChart";
import AmbientBackground from "../components/AmbientBackground";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [emailModal, setEmailModal] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState("");
  const [submittingLeaderboard, setSubmittingLeaderboard] = useState(null);
  const [leaderboardSuccess, setLeaderboardSuccess] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/report/my-sessions");
      setSessions(res.data.sessions);
    } catch (err) {
      console.error("Failed to fetch sessions:", err.message);
    } finally {
      setLoading(false);
    }
  };

    const fetchSessionDetail = async (id) => {
    try {
      const res = await API.get(`/report/session/${id}`);
      setSelectedSession(res.data.session);
    } catch (err) {
      console.error("Failed to fetch session detail:", err.message);
    }
  };

  const handleSendEmail = async () => {
    if (!emailInput || !emailModal) return;
    setEmailSending(true);
    setEmailSuccess("");
    try {
      await API.post("/report/send-email", {
        sessionId: emailModal,
        email: emailInput,
      });
      setEmailSuccess("✅ Report sent to your email!");
      setTimeout(() => {
        setEmailModal(null);
        setEmailInput("");
        setEmailSuccess("");
      }, 2000);
    } catch (err) {
      setEmailSuccess("❌ Failed to send. Try again.");
    } finally {
      setEmailSending(false);
    }
  };

  const handleLeaderboard = async (sessionId) => {
    setSubmittingLeaderboard(sessionId);
    setLeaderboardSuccess("");
    try {
      await API.post("/report/leaderboard", { sessionId });
      setLeaderboardSuccess("🏆 Score submitted to leaderboard!");
      setTimeout(() => setLeaderboardSuccess(""), 3000);
    } catch (err) {
      setLeaderboardSuccess(
        err.response?.data?.message || "❌ Failed to submit."
      );
      setTimeout(() => setLeaderboardSuccess(""), 3000);
    } finally {
      setSubmittingLeaderboard(null);
    }
  };

  const latestSession = sessions[0];
  const avgOverall = sessions.length > 0
    ? (sessions.reduce((acc, s) => acc + s.overallScore, 0) / sessions.length).toFixed(1)
    : 0;
  const bestScore = sessions.length > 0
    ? Math.max(...sessions.map((s) => s.overallScore))
    : 0;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary)",
      position: "relative",
    }}>
      <AmbientBackground />
      <Navbar />

      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "100px 24px 60px",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <div>
            <h1 style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: "var(--text-primary)",
              marginBottom: "6px",
              letterSpacing: "-0.5px",
            }}>
              Welcome back,{" "}
              <span className="gradient-text">{user?.name?.split(" ")[0]}</span> 👋
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Track your interview performance and improvement over time
            </p>
          </div>
          <button
            onClick={() => navigate("/home")}
            className="btn-primary"
            style={{ padding: "11px 24px", fontSize: "0.95rem" }}
          >
            + New Interview
          </button>
        </div>

        {loading ? (
          <div style={{
            textAlign: "center",
            color: "var(--text-muted)",
            padding: "80px",
          }}>
            <div style={{
              width: "40px", height: "40px",
              border: "3px solid var(--border-color)",
              borderTopColor: "var(--brand-primary)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }} />
            Loading your sessions...
          </div>
        ) : sessions.length === 0 ? (
          /* Empty State */
          <div className="glass-card" style={{
            padding: "80px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎤</div>
            <h3 style={{
              color: "var(--text-primary)",
              fontWeight: "700",
              fontSize: "1.3rem",
              marginBottom: "10px",
            }}>
              No interviews yet
            </h3>
            <p style={{
              color: "var(--text-secondary)",
              marginBottom: "28px",
            }}>
              Start your first AI-powered mock interview now!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="btn-primary"
              style={{ padding: "13px 32px" }}
            >
              🚀 Start Interview
            </button>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "24px",
            }}>
              {[
                {
                  label: "Total Sessions",
                  value: sessions.length,
                  icon: "🎯",
                  color: "#6366f1",
                },
                {
                  label: "Average Score",
                  value: `${avgOverall}/10`,
                  icon: "📊",
                  color: "#8b5cf6",
                },
                {
                  label: "Best Score",
                  value: `${bestScore}/10`,
                  icon: "🏆",
                  color: "#06b6d4",
                },
              ].map((stat) => (
                <div key={stat.label} className="glass-card glow-border" style={{
                  padding: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}>
                  <div style={{
                    width: "48px", height: "48px",
                    backgroundColor: "var(--bg-tertiary)",
                    borderRadius: "14px",
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0,
                    border: "1px solid var(--border-color)",
                  }}>
                    {stat.icon}
                  </div>
                  <div>
                    <p style={{
                      color: "var(--text-muted)",
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      margin: "0 0 4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: "1.6rem",
                      fontWeight: "800",
                      color: stat.color,
                      margin: 0,
                      lineHeight: 1,
                    }}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{
              display: "flex",
              gap: "4px",
              backgroundColor: "var(--glass-bg)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-color)",
              borderRadius: "14px",
              padding: "6px",
              marginBottom: "20px",
              width: "fit-content",
            }}>
              {["overview", "history"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "9px 22px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: activeTab === tab
                      ? "var(--brand-primary)"
                      : "transparent",
                    color: activeTab === tab
                      ? "#fff"
                      : "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)",
                    textTransform: "capitalize",
                  }}
                >
                  {tab === "overview" ? "📈 Overview" : "📋 History"}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}>
                {/* Line Chart */}
                <div className="glass-card" style={{ padding: "24px" }}>
                  <h3 style={{
                    margin: "0 0 20px",
                    color: "var(--text-primary)",
                    fontWeight: "700",
                    fontSize: "1rem",
                  }}>
                    📈 Score Trend
                  </h3>
                  <LineChart sessions={[...sessions].reverse()} />
                </div>

                {/* Radar Chart */}
                {latestSession && (
                  <div className="glass-card" style={{ padding: "24px" }}>
                    <h3 style={{
                      margin: "0 0 20px",
                      color: "var(--text-primary)",
                      fontWeight: "700",
                      fontSize: "1rem",
                    }}>
                      🎯 Latest Session Breakdown
                    </h3>
                    <RadarChart scores={{
                      technical: latestSession.overallScore,
                      clarity: latestSession.overallScore,
                      relevance: latestSession.overallScore,
                      structure: latestSession.overallScore,
                    }} />
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="glass-card" style={{ overflow: "hidden" }}>
                <div style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid var(--border-color)",
                }}>
                  <h3 style={{
                    margin: 0,
                    color: "var(--text-primary)",
                    fontWeight: "700",
                  }}>
                    All Sessions
                  </h3>
                </div>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--bg-tertiary)" }}>
                      {["Job Role", "Date", "Questions", "Score", "Actions"].map((h) => (
                        <th key={h} style={{
                          padding: "12px 20px",
                          textAlign: "left",
                          color: "var(--text-muted)",
                          fontWeight: "600",
                          fontSize: "0.82rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr
                        key={session.id}
                        style={{ borderTop: "1px solid var(--border-color)" }}
                      >
                        <td style={{
                          padding: "16px 20px",
                          color: "var(--text-primary)",
                          fontWeight: "600",
                          fontSize: "0.92rem",
                        }}>
                          {session.jobRole}
                        </td>
                        <td style={{
                          padding: "16px 20px",
                          color: "var(--text-secondary)",
                          fontSize: "0.88rem",
                        }}>
                          {new Date(session.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td style={{
                          padding: "16px 20px",
                          color: "var(--text-secondary)",
                        }}>
                          {session.totalQuestions}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{
                            backgroundColor: session.overallScore >= 7
                              ? "var(--success-bg)"
                              : session.overallScore >= 5
                              ? "var(--warning-bg)"
                              : "var(--error-bg)",
                            color: session.overallScore >= 7
                              ? "var(--score-high)"
                              : session.overallScore >= 5
                              ? "var(--score-mid)"
                              : "var(--score-low)",
                            padding: "4px 14px",
                            borderRadius: "20px",
                            fontWeight: "700",
                            fontSize: "0.85rem",
                            border: `1px solid ${
                              session.overallScore >= 7
                                ? "var(--success-border)"
                                : session.overallScore >= 5
                                ? "var(--warning-border)"
                                : "var(--error-border)"
                            }`,
                          }}>
                            {session.overallScore}/10
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <button
                              onClick={() => fetchSessionDetail(session.id)}
                              style={{
                                padding: "7px 14px",
                                backgroundColor: "var(--bg-tertiary)",
                                color: "var(--brand-primary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "0.78rem",
                                transition: "var(--transition-smooth)",
                              }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => setEmailModal(session.id)}
                              style={{
                                padding: "7px 14px",
                                backgroundColor: "var(--bg-tertiary)",
                                color: "var(--score-mid)",
                                border: "1px solid var(--warning-border)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "0.78rem",
                                transition: "var(--transition-smooth)",
                              }}
                            >
                              📧 Email
                            </button>
                            <button
                              onClick={() => handleLeaderboard(session.id)}
                              disabled={submittingLeaderboard === session.id}
                              style={{
                                padding: "7px 14px",
                                backgroundColor: "var(--bg-tertiary)",
                                color: "var(--score-high)",
                                border: "1px solid var(--success-border)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "0.78rem",
                                transition: "var(--transition-smooth)",
                                opacity: submittingLeaderboard === session.id ? 0.7 : 1,
                              }}
                            >
                              🏆 Submit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center",
            justifyContent: "center",
            zIndex: 2000, padding: "20px",
          }}
          onClick={() => setSelectedSession(null)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: "700px", width: "100%",
              maxHeight: "80vh", overflowY: "auto",
              padding: "32px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}>
              <h3 style={{
                margin: 0,
                color: "var(--text-primary)",
                fontWeight: "700",
              }}>
                {selectedSession.jobRole} — Session Details
              </h3>
              <button
                onClick={() => setSelectedSession(null)}
                style={{
                  background: "none", border: "none",
                  fontSize: "1.4rem", cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                ✕
              </button>
            </div>

            {/* Average Scores */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px", marginBottom: "24px",
            }}>
              {Object.entries(selectedSession.averageScores).map(([key, val]) => (
                <div key={key} style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderRadius: "12px", padding: "14px",
                  textAlign: "center",
                  border: "1px solid var(--border-color)",
                }}>
                  <div style={{
                    fontWeight: "800", fontSize: "1.4rem",
                    color: "var(--brand-primary)",
                  }}>
                    {val}
                  </div>
                  <div style={{
                    color: "var(--text-muted)",
                    fontSize: "0.75rem",
                    textTransform: "capitalize",
                    marginTop: "4px",
                  }}>
                    {key}
                  </div>
                </div>
              ))}
            </div>

            {/* Answers */}
            {selectedSession.answers.map((ans, i) => (
              <div key={i} style={{
                borderTop: "1px solid var(--border-color)",
                paddingTop: "16px", marginTop: "16px",
              }}>
                <p style={{
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                  fontSize: "0.92rem",
                }}>
                  Q{i + 1}: {ans.question}
                </p>
                <p style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.88rem",
                  marginBottom: "10px",
                  lineHeight: "1.6",
                }}>
                  {ans.transcript}
                </p>
                <div style={{
                  backgroundColor: "var(--bg-tertiary)",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  color: "var(--brand-primary)",
                  border: "1px solid var(--border-color)",
                }}>
                  💡 {ans.feedback}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Leaderboard Toast */}
      {leaderboardSuccess && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border-color)",
          borderRadius: "14px",
          padding: "16px 24px",
          boxShadow: "var(--shadow-lg)",
          zIndex: 2000,
          color: "var(--text-primary)",
          fontWeight: "600",
          fontSize: "0.9rem",
          animation: "fadeInUp 0.3s ease",
        }}>
          {leaderboardSuccess}
        </div>
      )}

      {/* Email Modal */}
      {emailModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setEmailModal(null)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: "420px",
              width: "100%",
              padding: "32px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top glow */}
            <div style={{
              position: "absolute",
              top: 0, left: "15%", right: "15%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
            }} />

            <h3 style={{
              color: "var(--text-primary)",
              fontWeight: "700",
              margin: "0 0 8px",
              fontSize: "1.1rem",
            }}>
              📧 Email Interview Report
            </h3>
            <p style={{
              color: "var(--text-secondary)",
              fontSize: "0.88rem",
              margin: "0 0 20px",
            }}>
              We'll send a full detailed report with all scores and feedback.
            </p>

            <input
              className="glass-input"
              type="email"
              placeholder="Enter your email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              style={{ marginBottom: "16px" }}
            />

            {emailSuccess && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "10px",
                marginBottom: "14px",
                fontSize: "0.88rem",
                fontWeight: "600",
                backgroundColor: emailSuccess.includes("✅")
                  ? "var(--success-bg)"
                  : "var(--error-bg)",
                color: emailSuccess.includes("✅")
                  ? "var(--score-high)"
                  : "var(--score-low)",
                border: `1px solid ${
                  emailSuccess.includes("✅")
                    ? "var(--success-border)"
                    : "var(--error-border)"
                }`,
              }}>
                {emailSuccess}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSendEmail}
                disabled={emailSending || !emailInput}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: "12px",
                  opacity: emailSending || !emailInput ? 0.7 : 1,
                  cursor: emailSending || !emailInput
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {emailSending ? "⏳ Sending..." : "📧 Send Report"}
              </button>
              <button
                onClick={() => {
                  setEmailModal(null);
                  setEmailInput("");
                  setEmailSuccess("");
                }}
                className="btn-secondary"
                style={{ padding: "12px 20px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;