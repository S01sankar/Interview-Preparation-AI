import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";
import AmbientBackground from "../components/AmbientBackground";
import Navbar from "../components/Navbar";
import API from "../utils/api";

const JOB_ROLES = [
  { label: "Frontend Developer", icon: "🎨" },
  { label: "Backend Developer", icon: "⚙️" },
  { label: "Full Stack Developer", icon: "🔥" },
  { label: "Data Scientist", icon: "📊" },
  { label: "Machine Learning Engineer", icon: "🤖" },
  { label: "DevOps Engineer", icon: "🚀" },
  { label: "Product Manager", icon: "📋" },
  { label: "UI/UX Designer", icon: "✨" },
  { label: "Software Architect", icon: "🏗️" },
  { label: "Mobile Developer", icon: "📱" },
];

const Home = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [pressureMode, setPressureMode] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejected) => {
    if (rejected.length > 0) {
      setError("Only PDF files are accepted.");
      return;
    }
    setResumeFile(acceptedFiles[0]);
    setError("");
    setStep(2);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleStart = async () => {
    const role = customRole.trim() || selectedRole;
    if (!role) return setError("Please select or enter a job role.");
    if (!resumeFile) return setError("Please upload your resume PDF.");

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      const uploadRes = await API.post("/interview/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const questionRes = await API.post("/interview/generate-questions", {
        jobRole: role,
        resumeText: uploadRes.data.resumeText,
        pressureMode,
      });

      navigate("/interview", {
        state: {
          sessionId: questionRes.data.sessionId,
          questions: questionRes.data.questions,
          jobRole: role,
          pressureMode,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start interview.");
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
        maxWidth: "800px",
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
            👋 Welcome back, {user?.name?.split(" ")[0]}!
          </div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            color: "var(--text-primary)",
            marginBottom: "12px",
            letterSpacing: "-0.5px",
          }}>
            Start Your{" "}
            <span className="gradient-text">AI Interview</span>
          </h1>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            lineHeight: "1.7",
          }}>
            Upload your resume and pick a role to get personalized
            AI-generated interview questions
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "32px",
        }}>
          {["Upload Resume", "Select Role", "Start Interview"].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                opacity: step >= i + 1 ? 1 : 0.4,
              }}>
                <div style={{
                  width: "28px", height: "28px",
                  borderRadius: "50%",
                  background: step >= i + 1
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "var(--bg-tertiary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: step >= i + 1 ? "#fff" : "var(--text-muted)",
                  fontSize: "0.75rem", fontWeight: "700",
                  border: step >= i + 1 ? "none" : "1px solid var(--border-color)",
                }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  color: step >= i + 1
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                }}>
                  {s}
                </span>
              </div>
              {i < 2 && (
                <div style={{
                  width: "40px", height: "1px",
                  backgroundColor: step > i + 1
                    ? "var(--brand-primary)"
                    : "var(--border-color)",
                  transition: "background-color 0.3s",
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Card */}
        <div className="glass-card" style={{ padding: "36px" }}>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: "var(--error-bg)",
              color: "var(--error-text)",
              border: "1px solid var(--error-border)",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "24px",
              fontSize: "0.88rem",
              fontWeight: "500",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Step 1 — Resume Upload */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "12px",
              color: "var(--text-primary)",
              fontWeight: "700", fontSize: "1rem",
            }}>
              <span style={{
                width: "24px", height: "24px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: "6px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "0.75rem", fontWeight: "800",
              }}>1</span>
              Upload Your Resume
            </label>

            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${
                  isDragActive
                    ? "var(--brand-primary)"
                    : resumeFile
                    ? "var(--score-high)"
                    : "var(--border-strong)"
                }`,
                backgroundColor: isDragActive
                  ? "var(--bg-tertiary)"
                  : resumeFile
                  ? "var(--success-bg)"
                  : "var(--glass-bg)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "32px",
                textAlign: "center",
                cursor: "pointer",
                transition: "var(--transition-smooth)",
              }}
            >
              <input {...getInputProps()} />
              {resumeFile ? (
                <div>
                  <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📄</div>
                  <p style={{
                    color: "var(--score-high)",
                    fontWeight: "700",
                    fontSize: "1rem",
                    margin: "0 0 4px",
                  }}>
                    ✅ {resumeFile.name}
                  </p>
                  <p style={{
                    color: "var(--text-muted)",
                    fontSize: "0.82rem", margin: 0,
                  }}>
                    {(resumeFile.size / 1024).toFixed(1)} KB — Click to replace
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "3rem", marginBottom: "12px" }}>☁️</div>
                  <p style={{
                    color: "var(--text-primary)",
                    fontWeight: "600", fontSize: "1rem",
                    margin: "0 0 6px",
                  }}>
                    {isDragActive
                      ? "Drop it here!"
                      : "Drag & drop your resume here"}
                  </p>
                  <p style={{
                    color: "var(--text-muted)",
                    fontSize: "0.82rem", margin: 0,
                  }}>
                    PDF only • Max 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 2 — Job Role */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "12px",
              color: "var(--text-primary)",
              fontWeight: "700", fontSize: "1rem",
            }}>
              <span style={{
                width: "24px", height: "24px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: "6px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "0.75rem", fontWeight: "800",
              }}>2</span>
              Select Job Role
            </label>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "14px",
            }}>
              {JOB_ROLES.map((role) => (
                <button
                  key={role.label}
                  onClick={() => {
                    setSelectedRole(role.label);
                    setCustomRole("");
                    setStep(3);
                  }}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "20px",
                    border: `1.5px solid ${
                      selectedRole === role.label
                        ? "var(--brand-primary)"
                        : "var(--border-color)"
                    }`,
                    backgroundColor: selectedRole === role.label
                      ? "var(--bg-tertiary)"
                      : "var(--glass-bg)",
                    backdropFilter: "blur(10px)",
                    color: selectedRole === role.label
                      ? "var(--brand-primary)"
                      : "var(--text-secondary)",
                    cursor: "pointer",
                    fontWeight: selectedRole === role.label ? "700" : "500",
                    fontSize: "0.85rem",
                    transition: "var(--transition-smooth)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {role.icon} {role.label}
                </button>
              ))}
            </div>

            <input
              className="glass-input"
              placeholder="Or type a custom role..."
              value={customRole}
              onChange={(e) => {
                setCustomRole(e.target.value);
                setSelectedRole("");
                if (e.target.value) setStep(3);
              }}
            />
          </div>

         
          {/* Pressure Mode Toggle */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: pressureMode
              ? "var(--error-bg)"
              : "var(--bg-tertiary)",
            border: `1px solid ${
              pressureMode
                ? "var(--error-border)"
                : "var(--border-color)"
            }`,
            borderRadius: "12px",
            padding: "14px 18px",
            marginBottom: "16px",
            transition: "var(--transition-smooth)",
            cursor: "pointer",
          }}
            onClick={() => setPressureMode(!pressureMode)}
          >
            <div>
              <p style={{
                margin: "0 0 4px",
                fontWeight: "700",
                color: pressureMode
                  ? "var(--score-low)"
                  : "var(--text-primary)",
                fontSize: "0.92rem",
              }}>
                {pressureMode ? "🔥 Pressure Mode ON" : "😊 Normal Mode"}
              </p>
              <p style={{
                margin: 0,
                fontSize: "0.78rem",
                color: pressureMode
                  ? "var(--error-text)"
                  : "var(--text-muted)",
              }}>
                {pressureMode
                  ? "Questions are harder. Scoring is strict."
                  : "Click to enable high pressure interview mode"}
              </p>
            </div>

            {/* Toggle Switch */}
            <div style={{
              width: "44px",
              height: "24px",
              backgroundColor: pressureMode
                ? "var(--score-low)"
                : "var(--border-color)",
              borderRadius: "12px",
              position: "relative",
              transition: "var(--transition-smooth)",
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute",
                top: "3px",
                left: pressureMode ? "23px" : "3px",
                width: "18px",
                height: "18px",
                backgroundColor: "#fff",
                borderRadius: "50%",
                transition: "var(--transition-smooth)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }} />
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={loading}
            className={pressureMode ? "btn-orange" : "btn-primary"}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "1.05rem",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "⏳ Preparing your interview..."
              : pressureMode
              ? "🔥 Start Pressure Interview"
              : "🚀 Start AI Interview"}
          </button>

          {/* Info row */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginTop: "16px",
            flexWrap: "wrap",
          }}>
            {[
              "⏱️ 5 questions",
              "🎙️ Voice recording",
              "📊 Instant scoring",
            ].map((info) => (
              <span key={info} style={{
                color: "var(--text-muted)",
                fontSize: "0.82rem",
                fontWeight: "500",
              }}>
                {info}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;