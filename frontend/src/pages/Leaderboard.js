import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AmbientBackground from "../components/AmbientBackground";
import Navbar from "../components/Navbar";
import API from "../utils/api";

const JOB_ROLES = [
  "All Roles",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Software Architect",
  "Mobile Developer",
];

const getRankIcon = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

const getRankColor = (rank) => {
  if (rank === 1) return {
    bg: "linear-gradient(135deg, #fef9c3, #fef3c7)",
    border: "rgba(234,179,8,0.3)",
    text: "#d97706",
  };
  if (rank === 2) return {
    bg: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
    border: "rgba(148,163,184,0.3)",
    text: "#64748b",
  };
  if (rank === 3) return {
    bg: "linear-gradient(135deg, #fef3c7, #fed7aa)",
    border: "rgba(217,119,6,0.3)",
    text: "#c2410c",
  };
  return {
    bg: "var(--bg-tertiary)",
    border: "var(--border-color)",
    text: "var(--text-secondary)",
  };
};

const getScoreColor = (score) => {
  if (score >= 8) return "var(--score-high)";
  if (score >= 6) return "var(--score-mid)";
  return "var(--score-low)";
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  fetchLeaderboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedRole]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");
    try {
      const params =
        selectedRole !== "All Roles"
          ? `?role=${encodeURIComponent(selectedRole)}`
          : "";
      const res = await API.get(`/report/leaderboard${params}`);
      setLeaderboard(res.data.leaderboard);
    } catch (err) {
      setError("Failed to fetch leaderboard.");
    } finally {
      setLoading(false);
    }
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
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--brand-primary)",
            padding: "6px 16px", borderRadius: "20px",
            fontSize: "0.85rem", fontWeight: "600",
            marginBottom: "20px",
            border: "1px solid var(--border-color)",
          }}>
            🏆 Global Rankings
          </div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            color: "var(--text-primary)",
            marginBottom: "12px",
            letterSpacing: "-0.5px",
          }}>
            Interview{" "}
            <span className="gradient-text">Leaderboard</span>
          </h1>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: "1.7",
          }}>
            See how you rank against other candidates globally
          </p>
        </div>

        {/* Role Filter */}
        <div className="glass-card" style={{
          padding: "20px 24px",
          marginBottom: "24px",
          overflowX: "auto",
        }}>
          <div style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}>
            {JOB_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: `1.5px solid ${
                    selectedRole === role
                      ? "var(--brand-primary)"
                      : "var(--border-color)"
                  }`,
                  backgroundColor: selectedRole === role
                    ? "var(--bg-tertiary)"
                    : "transparent",
                  color: selectedRole === role
                    ? "var(--brand-primary)"
                    : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: selectedRole === role ? "700" : "500",
                  fontSize: "0.82rem",
                  transition: "var(--transition-smooth)",
                  whiteSpace: "nowrap",
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: "var(--error-bg)",
            color: "var(--error-text)",
            border: "1px solid var(--error-border)",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "20px",
            fontSize: "0.88rem",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="glass-card" style={{
            padding: "80px",
            textAlign: "center",
          }}>
            <div style={{
              width: "40px", height: "40px",
              border: "3px solid var(--border-color)",
              borderTopColor: "var(--brand-primary)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }} />
            <p style={{ color: "var(--text-secondary)" }}>
              Loading leaderboard...
            </p>
          </div>
        ) : leaderboard.length === 0 ? (
          /* Empty state */
          <div className="glass-card" style={{
            padding: "80px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🏆</div>
            <h3 style={{
              color: "var(--text-primary)",
              fontSize: "1.3rem",
              fontWeight: "700",
              marginBottom: "10px",
            }}>
              No entries yet
            </h3>
            <p style={{
              color: "var(--text-secondary)",
              marginBottom: "24px",
              fontSize: "0.9rem",
            }}>
              Be the first one on the leaderboard!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="btn-primary"
              style={{ padding: "12px 28px" }}
            >
              🚀 Start Interview
            </button>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "16px",
                marginBottom: "28px",
              }}>
                {/* 2nd Place */}
                <div className="glass-card" style={{
                  padding: "20px",
                  textAlign: "center",
                  width: "180px",
                  background: getRankColor(2).bg,
                  border: `1px solid ${getRankColor(2).border}`,
                }}>
                  <div style={{
                    fontSize: "2rem",
                    marginBottom: "8px",
                  }}>
                    🥈
                  </div>
                  <div style={{
                    width: "44px", height: "44px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    color: "#fff", fontWeight: "800",
                    fontSize: "16px",
                    margin: "0 auto 8px",
                  }}>
                    {leaderboard[1]?.userName?.charAt(0).toUpperCase()}
                  </div>
                  <p style={{
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem",
                    margin: "0 0 4px",
                  }}>
                    {leaderboard[1]?.userName?.split(" ")[0]}
                  </p>
                  <p style={{
                    color: getScoreColor(leaderboard[1]?.overallScore),
                    fontWeight: "800",
                    fontSize: "1.3rem",
                    margin: 0,
                  }}>
                    {leaderboard[1]?.overallScore}
                  </p>
                </div>

                {/* 1st Place */}
                <div className="glass-card" style={{
                  padding: "24px 20px",
                  textAlign: "center",
                  width: "200px",
                  background: getRankColor(1).bg,
                  border: `1px solid ${getRankColor(1).border}`,
                  transform: "translateY(-16px)",
                  boxShadow: "0 8px 32px rgba(234,179,8,0.2)",
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
                    🥇
                  </div>
                  <div style={{
                    width: "52px", height: "52px",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    color: "#fff", fontWeight: "800",
                    fontSize: "20px",
                    margin: "0 auto 10px",
                    boxShadow: "0 4px 16px rgba(234,179,8,0.4)",
                  }}>
                    {leaderboard[0]?.userName?.charAt(0).toUpperCase()}
                  </div>
                  <p style={{
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    margin: "0 0 4px",
                  }}>
                    {leaderboard[0]?.userName?.split(" ")[0]}
                  </p>
                  <p style={{
                    color: getScoreColor(leaderboard[0]?.overallScore),
                    fontWeight: "900",
                    fontSize: "1.6rem",
                    margin: 0,
                  }}>
                    {leaderboard[0]?.overallScore}
                  </p>
                </div>

                {/* 3rd Place */}
                <div className="glass-card" style={{
                  padding: "20px",
                  textAlign: "center",
                  width: "180px",
                  background: getRankColor(3).bg,
                  border: `1px solid ${getRankColor(3).border}`,
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                    🥉
                  </div>
                  <div style={{
                    width: "44px", height: "44px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    color: "#fff", fontWeight: "800",
                    fontSize: "16px",
                    margin: "0 auto 8px",
                  }}>
                    {leaderboard[2]?.userName?.charAt(0).toUpperCase()}
                  </div>
                  <p style={{
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem",
                    margin: "0 0 4px",
                  }}>
                    {leaderboard[2]?.userName?.split(" ")[0]}
                  </p>
                  <p style={{
                    color: getScoreColor(leaderboard[2]?.overallScore),
                    fontWeight: "800",
                    fontSize: "1.3rem",
                    margin: 0,
                  }}>
                    {leaderboard[2]?.overallScore}
                  </p>
                </div>
              </div>
            )}

            {/* Full Table */}
            <div className="glass-card" style={{ overflow: "hidden" }}>
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <h3 style={{
                  margin: 0,
                  color: "var(--text-primary)",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                }}>
                  🏆 Full Rankings
                </h3>
                <span style={{
                  color: "var(--text-muted)",
                  fontSize: "0.82rem",
                }}>
                  Top {leaderboard.length} candidates
                </span>
              </div>

              <table style={{
                width: "100%",
                borderCollapse: "collapse",
              }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-tertiary)" }}>
                    {["Rank", "Candidate", "Role", "Score", "Date"].map((h) => (
                      <th key={h} style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        color: "var(--text-muted)",
                        fontWeight: "700",
                        fontSize: "0.78rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.rank}
                      style={{
                        borderTop: "1px solid var(--border-color)",
                        backgroundColor: entry.isCurrentUser
                          ? "var(--bg-tertiary)"
                          : "transparent",
                        transition: "var(--transition-smooth)",
                      }}
                    >
                      {/* Rank */}
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          fontSize: entry.rank <= 3 ? "1.4rem" : "0.95rem",
                          fontWeight: "800",
                          color: getRankColor(entry.rank).text,
                        }}>
                          {getRankIcon(entry.rank)}
                        </span>
                      </td>

                      {/* Candidate */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}>
                          <div style={{
                            width: "36px", height: "36px",
                            background: entry.isCurrentUser
                              ? "linear-gradient(135deg, #f59e0b, #d97706)"
                              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            borderRadius: "50%",
                            display: "flex", alignItems: "center",
                            justifyContent: "center",
                            color: "#fff", fontWeight: "700",
                            fontSize: "14px",
                            flexShrink: 0,
                          }}>
                            {entry.userName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{
                              margin: 0,
                              fontWeight: "700",
                              color: "var(--text-primary)",
                              fontSize: "0.9rem",
                            }}>
                              {entry.userName}
                              {entry.isCurrentUser && (
                                <span style={{
                                  marginLeft: "8px",
                                  backgroundColor: "var(--bg-tertiary)",
                                  color: "var(--brand-primary)",
                                  padding: "2px 8px",
                                  borderRadius: "20px",
                                  fontSize: "0.7rem",
                                  fontWeight: "700",
                                  border: "1px solid var(--border-color)",
                                }}>
                                  You
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{
                        padding: "16px 20px",
                        color: "var(--text-secondary)",
                        fontSize: "0.88rem",
                      }}>
                        {entry.jobRole}
                      </td>

                      {/* Score */}
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          color: getScoreColor(entry.overallScore),
                          fontWeight: "800",
                          fontSize: "1.1rem",
                        }}>
                          {entry.overallScore}
                          <span style={{
                            color: "var(--text-muted)",
                            fontWeight: "500",
                            fontSize: "0.82rem",
                          }}>
                            /10
                          </span>
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{
                        padding: "16px 20px",
                        color: "var(--text-muted)",
                        fontSize: "0.82rem",
                      }}>
                        {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA */}
            <div className="glass-card" style={{
              padding: "28px",
              textAlign: "center",
              marginTop: "20px",
            }}>
              <p style={{
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "1rem",
                margin: "0 0 6px",
              }}>
                Want to climb the rankings?
              </p>
              <p style={{
                color: "var(--text-secondary)",
                fontSize: "0.88rem",
                margin: "0 0 20px",
              }}>
                Practice more interviews and submit your best score!
              </p>
              <button
                onClick={() => navigate("/home")}
                className="btn-primary"
                style={{ padding: "12px 28px" }}
              >
                🚀 Practice Now
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;