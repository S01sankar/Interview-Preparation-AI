import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AmbientBackground from "../components/AmbientBackground";
import Navbar from "../components/Navbar";
import API from "../utils/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      login(data.user, data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary)",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <AmbientBackground />
      <Navbar />

      {/* Card */}
      <div
        className="glass-card animate-fadeInUp"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "44px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top glow line */}
        <div style={{
          position: "absolute",
          top: 0, left: "20%", right: "20%",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)",
          borderRadius: "2px",
        }} />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px", height: "56px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
            fontSize: "24px",
          }}>🎯</div>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "var(--text-primary)",
            letterSpacing: "-0.5px",
            marginBottom: "6px",
          }}>
            Welcome back
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Sign in to continue your interview practice
          </p>
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
            fontWeight: "500",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "var(--text-secondary)",
              fontWeight: "600",
              fontSize: "0.88rem",
            }}>
              Email Address
            </label>
            <input
              className="glass-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "var(--text-secondary)",
              fontWeight: "600",
              fontSize: "0.88rem",
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="glass-input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingRight: "48px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer", fontSize: "1rem",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "1rem",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "⏳ Signing in..." : "Sign In →"}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "12px", margin: "24px 0",
        }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
        </div>

        {/* Register link */}
        <p style={{
          textAlign: "center",
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
        }}>
          Don't have an account?{" "}
          <Link to="/register" style={{
            color: "var(--brand-primary)",
            fontWeight: "700",
            textDecoration: "none",
          }}>
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;