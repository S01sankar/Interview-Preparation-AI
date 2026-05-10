import React, { useState, useRef, useEffect } from "react";
import AmbientBackground from "../components/AmbientBackground";
import Navbar from "../components/Navbar";
import API from "../utils/api";

const DEBATE_TOPICS = [
  "REST API is better than GraphQL",
  "NoSQL databases are better than SQL",
  "React is better than Vue.js",
  "Microservices are better than Monolith",
  "TypeScript should replace JavaScript",
  "Cloud is always better than On-Premise",
  "Agile is better than Waterfall",
  "Python is the best language for AI",
];

const JOB_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Software Architect",
];

const DebateArena = () => {
  const [stage, setStage] = useState("setup");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [jobRole, setJobRole] = useState("Full Stack Developer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debate state
  const [history, setHistory] = useState([]);
  const [scores, setScores] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [responding, setResponding] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [roundCount, setRoundCount] = useState(0);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleStartDebate = async () => {
    const selectedTopic = customTopic.trim() || topic;
    if (!selectedTopic) {
      return setError("Please select or enter a debate topic");
    }
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/debate/start", {
        topic: selectedTopic,
        jobRole,
      });

      const { opponentPosition, openingArgument, crossQuestion } = res.data.debate;

      setHistory([
        {
          role: "opponent",
          content: `${openingArgument}\n\n❓ ${crossQuestion}`,
          type: "opening",
        },
      ]);

      setTopic(selectedTopic);
      setStage("debate");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start debate");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async () => {
    if (!userInput.trim()) return;

    const userMsg = {
      role: "user",
      content: userInput,
      type: "argument",
    };

    setHistory((prev) => [...prev, userMsg]);
    setUserInput("");
    setResponding(true);

    try {
      const res = await API.post("/debate/respond", {
        topic,
        jobRole,
        history: history.map((h) => ({
          role: h.role === "opponent" ? "assistant" : "user",
          content: h.content,
        })),
        userArgument: userInput,
      });

      setHistory((prev) => [
        ...prev,
        {
          role: "opponent",
          content: res.data.response,
          type: "response",
          score: res.data.score,
          feedback: res.data.feedback,
        },
      ]);

      setScores((prev) => [...prev, res.data.score]);
      setRoundCount((prev) => prev + 1);
    } catch (err) {
      setError("Failed to get response. Try again.");
    } finally {
      setResponding(false);
    }
  };

  const handleEndDebate = async () => {
    setLoading(true);
    try {
      const res = await API.post("/debate/end", {
        topic,
        jobRole,
        scores,
      });
      setFinalResult(res.data.result);
      setStage("result");
    } catch (err) {
      setError("Failed to end debate.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "var(--score-high)";
    if (score >= 6) return "var(--score-mid)";
    return "var(--score-low)";
  };

  const avgScore = scores.length > 0
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
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
        maxWidth: "860px",
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
            color: "var(--brand-secondary)",
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: "600",
            marginBottom: "20px",
            border: "1px solid var(--warning-border)",
          }}>
            🥊 AI Debate Opponent
          </div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            color: "var(--text-primary)",
            marginBottom: "12px",
            letterSpacing: "-0.5px",
          }}>
            Technical{" "}
            <span className="gradient-text">Debate Arena</span>
          </h1>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: "1.7",
            maxWidth: "560px",
            margin: "0 auto",
          }}>
            Challenge the AI in technical debates to sharpen your
            critical thinking and communication skills
          </p>
        </div>

        {/* Setup Stage */}
        {stage === "setup" && (
          <div className="glass-card animate-fadeInUp" style={{
            padding: "32px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: 0, left: "15%", right: "15%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #ff9900, #2874f0, transparent)",
            }} />

            {/* Job Role */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "10px",
                color: "var(--text-secondary)",
                fontWeight: "600",
                fontSize: "0.88rem",
              }}>
                Your Job Role
              </label>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}>
                {JOB_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setJobRole(role)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "20px",
                      border: `1.5px solid ${
                        jobRole === role
                          ? "var(--brand-primary)"
                          : "var(--border-color)"
                      }`,
                      backgroundColor: jobRole === role
                        ? "var(--bg-tertiary)"
                        : "transparent",
                      color: jobRole === role
                        ? "var(--brand-primary)"
                        : "var(--text-secondary)",
                      cursor: "pointer",
                      fontWeight: jobRole === role ? "700" : "500",
                      fontSize: "0.82rem",
                      transition: "var(--transition-smooth)",
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "10px",
                color: "var(--text-secondary)",
                fontWeight: "600",
                fontSize: "0.88rem",
              }}>
                Select Debate Topic
              </label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "14px",
              }}>
                {DEBATE_TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTopic(t);
                      setCustomTopic("");
                    }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: `1.5px solid ${
                        topic === t
                          ? "var(--brand-secondary)"
                          : "var(--border-color)"
                      }`,
                      backgroundColor: topic === t
                        ? "var(--warning-bg)"
                        : "var(--bg-tertiary)",
                      color: topic === t
                        ? "var(--brand-secondary)"
                        : "var(--text-secondary)",
                      cursor: "pointer",
                      fontWeight: topic === t ? "700" : "500",
                      fontSize: "0.82rem",
                      textAlign: "left",
                      transition: "var(--transition-smooth)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <input
                className="glass-input"
                placeholder="Or type a custom topic..."
                value={customTopic}
                onChange={(e) => {
                  setCustomTopic(e.target.value);
                  setTopic("");
                }}
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

            {/* Start Button */}
            <button
              onClick={handleStartDebate}
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
                ? "⏳ Preparing debate..."
                : "🥊 Start Debate"}
            </button>
          </div>
        )}

        {/* Debate Stage */}
        {stage === "debate" && (
          <div className="animate-fadeIn">

            {/* Debate Info Bar */}
            <div className="glass-card" style={{
              padding: "16px 24px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}>
              <div>
                <span className="badge-orange">
                  🥊 {topic}
                </span>
              </div>
              <div style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}>
                <span style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}>
                  Rounds: {roundCount}
                </span>
                {scores.length > 0 && (
                  <span style={{
                    color: getScoreColor(avgScore),
                    fontWeight: "700",
                    fontSize: "0.9rem",
                  }}>
                    Avg Score: {avgScore}/10
                  </span>
                )}
                <button
                  onClick={handleEndDebate}
                  disabled={loading || scores.length === 0}
                  style={{
                    padding: "7px 16px",
                    backgroundColor: "var(--error-bg)",
                    color: "var(--error-text)",
                    border: "1px solid var(--error-border)",
                    borderRadius: "8px",
                    cursor: scores.length === 0 ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    fontSize: "0.82rem",
                    opacity: scores.length === 0 ? 0.5 : 1,
                  }}
                >
                  🏁 End Debate
                </button>
              </div>
            </div>

            {/* Chat Window */}
            <div className="glass-card" style={{
              padding: "0",
              marginBottom: "16px",
              overflow: "hidden",
            }}>
              {/* Chat Header */}
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-tertiary)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <div style={{
                  width: "36px", height: "36px",
                  background: "var(--gradient-secondary)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                }}>
                  🤖
                </div>
                <div>
                  <p style={{
                    margin: 0,
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                  }}>
                    AI Debate Opponent
                  </p>
                  <p style={{
                    margin: 0,
                    color: "var(--score-high)",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}>
                    ● Online
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div style={{
                height: "420px",
                overflowY: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}>
                {history.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: msg.role === "user"
                        ? "flex-end"
                        : "flex-start",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Opponent Avatar */}
                    {msg.role === "opponent" && (
                      <div style={{
                        width: "32px", height: "32px",
                        background: "var(--gradient-secondary)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                        flexShrink: 0,
                      }}>
                        🤖
                      </div>
                    )}

                    <div style={{ maxWidth: "75%" }}>
                      {/* Message Bubble */}
                      <div style={{
                        backgroundColor: msg.role === "user"
                          ? "var(--gradient-primary)"
                          : "var(--bg-tertiary)",
                        background: msg.role === "user"
                          ? "linear-gradient(135deg, #2874f0, #0950c5)"
                          : "var(--bg-tertiary)",
                        color: msg.role === "user"
                          ? "#fff"
                          : "var(--text-primary)",
                        padding: "12px 16px",
                        borderRadius: msg.role === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                        fontSize: "0.88rem",
                        lineHeight: "1.6",
                        border: msg.role === "opponent"
                          ? "1px solid var(--border-color)"
                          : "none",
                        whiteSpace: "pre-wrap",
                      }}>
                        {msg.content}
                      </div>

                      {/* Score badge for opponent response */}
                      {msg.score && (
                        <div style={{
                          marginTop: "6px",
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}>
                          <span style={{
                            backgroundColor: "var(--bg-secondary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "20px",
                            padding: "3px 10px",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            color: getScoreColor(msg.score),
                          }}>
                            Your Score: {msg.score}/10
                          </span>
                          {msg.feedback && (
                            <span style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                            }}>
                              {msg.feedback}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {msg.role === "user" && (
                      <div style={{
                        width: "32px", height: "32px",
                        background: "var(--gradient-primary)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                        flexShrink: 0,
                      }}>
                        👤
                      </div>
                    )}
                  </div>
                ))}

                {/* Responding indicator */}
                {responding && (
                  <div style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}>
                    <div style={{
                      width: "32px", height: "32px",
                      background: "var(--gradient-secondary)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                    }}>
                      🤖
                    </div>
                    <div style={{
                      backgroundColor: "var(--bg-tertiary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "16px 16px 16px 4px",
                      padding: "12px 16px",
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} style={{
                          width: "8px", height: "8px",
                          backgroundColor: "var(--brand-secondary)",
                          borderRadius: "50%",
                          animation: `bounce 1s infinite ${i * 0.2}s`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div style={{
                padding: "16px 20px",
                borderTop: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
                display: "flex",
                gap: "10px",
              }}>
                <textarea
                  className="glass-input"
                  placeholder="Type your argument here..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleRespond();
                    }
                  }}
                  rows={2}
                  style={{ resize: "none", flex: 1 }}
                />
                <button
                  onClick={handleRespond}
                  disabled={responding || !userInput.trim()}
                  className="btn-primary"
                  style={{
                    padding: "12px 20px",
                    opacity: responding || !userInput.trim() ? 0.6 : 1,
                    cursor: responding || !userInput.trim()
                      ? "not-allowed"
                      : "pointer",
                    alignSelf: "flex-end",
                    whiteSpace: "nowrap",
                  }}
                >
                  Send →
                </button>
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
                fontSize: "0.88rem",
              }}>
                ⚠️ {error}
              </div>
            )}
          </div>
        )}

        {/* Result Stage */}
        {stage === "result" && finalResult && (
          <div className="animate-fadeInUp">
            <div className="glass-card" style={{
              padding: "36px",
              textAlign: "center",
              marginBottom: "20px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: 0, left: "10%", right: "10%",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #2874f0, #ff9900, transparent)",
              }} />

              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>
                🏆
              </div>
              <h2 style={{
                fontSize: "1.8rem",
                fontWeight: "800",
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}>
                Debate Complete!
              </h2>
              <p style={{
                color: "var(--text-secondary)",
                marginBottom: "24px",
                fontSize: "0.9rem",
              }}>
                Topic: {topic}
              </p>

              {/* Score */}
              <div style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "var(--bg-tertiary)",
                borderRadius: "20px",
                padding: "20px 48px",
                marginBottom: "24px",
                border: "1px solid var(--border-color)",
              }}>
                <span style={{
                  fontSize: "3.5rem",
                  fontWeight: "900",
                  color: getScoreColor(finalResult.overallScore),
                  lineHeight: 1,
                }}>
                  {finalResult.overallScore}
                </span>
                <span style={{
                  color: "var(--text-muted)",
                  fontSize: "0.88rem",
                  marginTop: "4px",
                }}>
                  out of 10
                </span>
                <span style={{
                  color: getScoreColor(finalResult.overallScore),
                  fontWeight: "700",
                  marginTop: "6px",
                  fontSize: "0.95rem",
                }}>
                  {finalResult.grade}
                </span>
              </div>

              {/* Summary */}
              <p style={{
                color: "var(--text-secondary)",
                lineHeight: "1.7",
                marginBottom: "24px",
                fontSize: "0.95rem",
                maxWidth: "560px",
                margin: "0 auto 24px",
              }}>
                {finalResult.summary}
              </p>

              {/* Strengths and Improvements */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "24px",
                textAlign: "left",
              }}>
                <div style={{
                  backgroundColor: "var(--success-bg)",
                  border: "1px solid var(--success-border)",
                  borderRadius: "12px",
                  padding: "16px",
                }}>
                  <p style={{
                    color: "var(--score-high)",
                    fontWeight: "700",
                    fontSize: "0.82rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 0 10px",
                  }}>
                    ✅ Strengths
                  </p>
                  {(finalResult.strengths || []).map((s, i) => (
                    <p key={i} style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.88rem",
                      margin: "0 0 6px",
                      lineHeight: "1.5",
                    }}>
                      • {s}
                    </p>
                  ))}
                </div>
                <div style={{
                  backgroundColor: "var(--warning-bg)",
                  border: "1px solid var(--warning-border)",
                  borderRadius: "12px",
                  padding: "16px",
                }}>
                  <p style={{
                    color: "var(--score-mid)",
                    fontWeight: "700",
                    fontSize: "0.82rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 0 10px",
                  }}>
                    📈 Improve
                  </p>
                  {(finalResult.improvements || []).map((s, i) => (
                    <p key={i} style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.88rem",
                      margin: "0 0 6px",
                      lineHeight: "1.5",
                    }}>
                      • {s}
                    </p>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setStage("setup");
                  setHistory([]);
                  setScores([]);
                  setRoundCount(0);
                  setFinalResult(null);
                  setTopic("");
                  setCustomTopic("");
                }}
                className="btn-primary"
                style={{ padding: "13px 32px" }}
              >
                🔄 Start New Debate
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default DebateArena;