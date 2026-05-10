import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactMic } from "react-mic";
import Timer from "../components/Timer";
import FeedbackCard from "../components/FeedbackCard";
import AmbientBackground from "../components/AmbientBackground";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import socket from "../utils/socket";
import AuraScore from "../components/AuraScore";
import PersonalityCard from "../components/PersonalityCard";
import PredictionCard from "../components/PredictionCard";
import ProjectIdeas from "../components/ProjectIdeas";
import PressureMeter from "../components/PressureMeter";

const Interview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    sessionId,
    questions = [],
    jobRole = "",
    pressureMode = false,
  } = state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [scoreResult, setScoreResult] = useState(null);
  const [allAnswers, setAllAnswers] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [status, setStatus] = useState("ready");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId || questions.length === 0) {
      navigate("/home");
      return;
    }
    socket.connect();
    socket.emit("join-session", sessionId);
    socket.on("processing", () => setStatus("processing"));
    return () => {
      socket.off("processing");
      socket.disconnect();
    };
  }, [sessionId, questions, navigate]);

  const startRecording = () => {
    setIsRecording(true);
    setIsTimerRunning(true);
    setTranscript("");
    setScoreResult(null);
    setError("");
    setStatus("recording");
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsTimerRunning(false);
  };

  const onStopRecording = async (recordedBlob) => {
    setStatus("processing");
    setProcessing(true);
    socket.emit("processing", sessionId);

    try {
      const audioFile = new File([recordedBlob.blob], "answer.webm", {
        type: recordedBlob.blob.type,
      });
      const formData = new FormData();
      formData.append("audio", audioFile);

      const transcribeRes = await API.post("/interview/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const userTranscript = transcribeRes.data.transcript;
      setTranscript(userTranscript);

      const scoreRes = await API.post("/interview/score-answer", {
        sessionId,
        question: questions[currentIndex],
        transcript: userTranscript,
        jobRole,
        pressureMode,
      });

      const result = {
        question: questions[currentIndex],
        transcript: userTranscript,
        scores: scoreRes.data.scores,
        overall: scoreRes.data.overall,
        feedback: scoreRes.data.feedback,
      };

      setScoreResult(result);
      setAllAnswers((prev) => [...prev, result]);
      setStatus("scored");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process answer.");
      setStatus("ready");
    } finally {
      setProcessing(false);
    }
  };

  const handleNext = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setProcessing(true);
      try {
        const res = await API.post("/interview/complete-session", { sessionId });
        setFinalReport(res.data.report);
        setSessionComplete(true);
        setStatus("done");
      } catch (err) {
        setError("Failed to complete session.");
      } finally {
        setProcessing(false);
      }
    } else {
      setCurrentIndex(nextIndex);
      setTranscript("");
      setScoreResult(null);
      setError("");
      setStatus("ready");
    }
  };

  const handleTimeUp = () => {
    if (isRecording) stopRecording();
  };

  if (!state) return null;

  // Session Complete View
  if (sessionComplete && finalReport) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        position: "relative",
      }}>
        <AmbientBackground />
        <Navbar />

        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "100px 24px 60px",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Report Card */}
          <div className="glass-card" style={{
            padding: "40px",
            textAlign: "center",
            marginBottom: "24px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top glow line */}
            <div style={{
              position: "absolute",
              top: 0, left: "10%", right: "10%",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #06b6d4, transparent)",
            }} />

            <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>🎉</div>
            <h2 style={{
              fontSize: "2rem", fontWeight: "800",
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}>
              Interview Complete!
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
              Role: <strong>{finalReport.jobRole}</strong>
            </p>

            {/* Overall Score */}
            <div style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "20px",
              padding: "24px 48px",
              marginBottom: "28px",
              border: "1px solid var(--border-color)",
            }}>
              <span style={{
                fontSize: "4rem", fontWeight: "900",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
              }}>
                {finalReport.overallAverage}
              </span>
              <span style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                marginTop: "4px",
              }}>
                out of 10
              </span>
            </div>

            {/* Strongest / Weakest */}
            <div style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}>
              <div style={{
                backgroundColor: "var(--success-bg)",
                border: "1px solid var(--success-border)",
                borderRadius: "12px",
                padding: "12px 20px",
              }}>
                <p style={{
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  margin: "0 0 4px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  💪 Strongest
                </p>
                <p style={{
                  color: "var(--score-high)",
                  fontWeight: "700",
                  margin: 0,
                  textTransform: "capitalize",
                }}>
                  {finalReport.strongestDimension}
                </p>
              </div>
              <div style={{
                backgroundColor: "var(--error-bg)",
                border: "1px solid var(--error-border)",
                borderRadius: "12px",
                padding: "12px 20px",
              }}>
                <p style={{
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  margin: "0 0 4px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  📈 Improve
                </p>
                <p style={{
                  color: "var(--score-low)",
                  fontWeight: "700",
                  margin: 0,
                  textTransform: "capitalize",
                }}>
                  {finalReport.weakestDimension}
                </p>
              </div>
            </div>

            {/* Suggestion */}
            <div style={{
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "14px",
              padding: "18px",
              textAlign: "left",
              border: "1px solid var(--border-color)",
              marginBottom: "28px",
            }}>
              <p style={{
                color: "var(--brand-primary)",
                fontWeight: "700",
                margin: "0 0 8px",
                fontSize: "0.9rem",
              }}>
                💡 AI Improvement Suggestion
              </p>
              <p style={{
                color: "var(--text-secondary)",
                margin: 0,
                lineHeight: "1.7",
                fontSize: "0.92rem",
              }}>
                {finalReport.improvementSuggestion}
              </p>
            </div>
            {/* Aura Score */}
            {finalReport.auraScore && (
              <div style={{
                backgroundColor: "var(--bg-tertiary)",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                marginBottom: "20px",
              }}>
                <h3 style={{
                  color: "var(--text-primary)",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  padding: "16px 20px 0",
                  margin: 0,
                }}>
                  ✨ Your Interview Aura
                </h3>
                <AuraScore score={finalReport.auraScore} />
                {finalReport.auraFeedback && (
                  <div style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "0 0 16px 16px",
                    padding: "14px 20px",
                    borderTop: "1px solid var(--border-color)",
                    fontSize: "0.88rem",
                    color: "var(--text-secondary)",
                  }}>
                    💡 {finalReport.auraFeedback}
                  </div>  
                )}
              </div>
            )}

                {/* Personality Mirror */}
            {finalReport.personality && (
              <PersonalityCard personality={finalReport.personality} />
            )}

            {/* Prediction */}
            {finalReport.prediction && (
              <PredictionCard prediction={finalReport.prediction} />
            )}

            {/* Project Ideas */}
            {finalReport.projectIdeas && (
              <ProjectIdeas
                projects={finalReport.projectIdeas}
                weakArea={finalReport.weakestDimension}
              />
            )}
            
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary"
              style={{ padding: "13px 36px", fontSize: "1rem" }}
            >
              View Dashboard →
            </button>
          </div>

          {/* Full Breakdown */}
          <h3 style={{
            color: "var(--text-primary)",
            fontWeight: "700",
            marginBottom: "16px",
            fontSize: "1.1rem",
          }}>
            Full Answer Breakdown
          </h3>
          {allAnswers.map((ans, i) => (
            <FeedbackCard key={i} {...ans} index={i} />
          ))}
        </div>
      </div>
    );
  }

  // Interview View
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary)",
      position: "relative",
    }}>
      <AmbientBackground />
      <Navbar />

      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "100px 24px 60px",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Pressure Meter */}
        {pressureMode && (
          <PressureMeter
            level={pressureMode ? "high" : "normal"}
            scores={allAnswers.map((a) => a.overall)}
          />
        )}

        {/* Progress Bar */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}>
            <span style={{
              color: "var(--text-secondary)",
              fontSize: "0.88rem",
              fontWeight: "600",
            }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--brand-primary)",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.82rem",
              fontWeight: "700",
              border: "1px solid var(--border-color)",
            }}>
              {jobRole}
            </span>
          </div>
          <div style={{
            height: "6px",
            backgroundColor: "var(--border-color)",
            borderRadius: "3px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              borderRadius: "3px",
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* Question Card */}
        <div
          className="glass-card glow-border"
          style={{
            padding: "28px",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden",
            border: pressureMode
              ? "1px solid var(--error-border)"
              : "1px solid var(--border-color)",
          }}
        >
          <div style={{
            position: "absolute",
            top: 0, left: "10%", right: "10%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
          }} />
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--brand-primary)",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: "700",
            marginBottom: "14px",
            border: "1px solid var(--border-color)",
          }}>
            🎯 Question {currentIndex + 1}
          </div>
          <p style={{
            color: "var(--text-primary)",
            fontSize: "1.15rem",
            lineHeight: "1.7",
            margin: 0,
            fontWeight: "600",
          }}>
            {questions[currentIndex]}
          </p>
        </div>

        {/* Timer */}
        <div className="glass-card" style={{
          padding: "20px 28px",
          marginBottom: "20px",
        }}>
          <Timer
            duration={120}
            onTimeUp={handleTimeUp}
            isRunning={isTimerRunning}
          />
        </div>

        {/* Recording Card */}
        <div className="glass-card" style={{
          padding: "28px",
          textAlign: "center",
          marginBottom: "20px",
        }}>
          <ReactMic
            record={isRecording}
            onStop={onStopRecording}
            mimeType="audio/webm"
            strokeColor="#6366f1"
            backgroundColor="transparent"
            style={{
              width: "100%",
              height: "60px",
              borderRadius: "12px",
              marginBottom: "16px",
            }}
          />

          {error && (
            <div style={{
              backgroundColor: "var(--error-bg)",
              color: "var(--error-text)",
              border: "1px solid var(--error-border)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "14px",
              fontSize: "0.88rem",
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
          }}>
            {status === "ready" && (
              <button
                onClick={startRecording}
                className="btn-primary"
                style={{ padding: "13px 32px", fontSize: "1rem" }}
              >
                🎙️ Start Recording
              </button>
            )}

            {status === "recording" && (
              <button
                onClick={stopRecording}
                style={{
                  padding: "13px 32px",
                  backgroundColor: "var(--error-bg)",
                  color: "var(--error-text)",
                  border: "1px solid var(--error-border)",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  animation: "pulse-glow 1.5s infinite",
                }}
              >
                ⏹️ Stop & Submit
              </button>
            )}

            {status === "processing" && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "var(--brand-primary)",
                fontWeight: "600",
                padding: "13px 32px",
                backgroundColor: "var(--bg-tertiary)",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
              }}>
                <div style={{
                  width: "18px", height: "18px",
                  border: "2px solid var(--brand-primary)",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                Analysing your answer...
              </div>
            )}
          </div>
        </div>

        {/* Transcript + Score */}
        {status === "scored" && scoreResult && (
          <>
            <div className="glass-card" style={{
              padding: "22px",
              marginBottom: "16px",
            }}>
              <h4 style={{
                color: "var(--text-primary)",
                margin: "0 0 10px",
                fontWeight: "700",
                fontSize: "0.95rem",
              }}>
                📝 Your Transcript
              </h4>
              <p style={{
                color: "var(--text-secondary)",
                lineHeight: "1.7",
                margin: 0,
                fontSize: "0.92rem",
              }}>
                {transcript}
              </p>
            </div>

            <FeedbackCard {...scoreResult} index={currentIndex} />

            {/* Pressure Feedback */}
            {pressureMode && scoreResult?.pressureFeedback && (
              <div style={{
                backgroundColor: "var(--error-bg)",
                border: "1px solid var(--error-border)",
                borderRadius: "12px",
                padding: "14px 18px",
                marginBottom: "16px",
                fontSize: "0.88rem",
                color: "var(--error-text)",
                fontWeight: "500",
                lineHeight: "1.6",
              }}>
                🔥 <strong>Pressure Feedback:</strong>{" "}
                {scoreResult.pressureFeedback}
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={processing}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "1.05rem",
                marginBottom: "32px",
                opacity: processing ? 0.7 : 1,
              }}
            >
              {currentIndex + 1 >= questions.length
                ? "🏁 Complete Interview"
                : "Next Question →"}
            </button>
          </>
        )}
      </div>

      {/* Spinner CSS */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Interview;