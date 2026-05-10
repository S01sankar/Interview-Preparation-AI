import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home", path: "/home" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Projects", path: "/project-explainer" },
    { label: "Debate", path: "/debate" },
    { label: "Career", path: "/career" },
  ];

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      height: "68px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      background: scrolled ? "var(--nav-bg)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled
        ? "1px solid var(--nav-border)"
        : "none",
      transition: "var(--transition-smooth)",
    }}>

      {/* Left — Logo */}
      <Logo />

      {/* Center — Nav Links */}
      {user && (
        <div style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "3px",
          background: "var(--glass-bg)",
          backdropFilter: "blur(16px)",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          padding: "5px",
          boxShadow: "var(--shadow-sm)",
        }}>
          {navLinks.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: "7px 13px",
                borderRadius: "11px",
                border: "none",
                backgroundColor: isActive(item.path)
                  ? "var(--brand-primary)"
                  : "transparent",
                color: isActive(item.path)
                  ? "#fff"
                  : "var(--text-secondary)",
                fontWeight: isActive(item.path) ? "700" : "500",
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "var(--transition-smooth)",
                whiteSpace: "nowrap",
                boxShadow: isActive(item.path)
                  ? "0 2px 8px rgba(40,116,240,0.4)"
                  : "none",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Right — Theme + User */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexShrink: 0,
      }}>
        {/* Theme Toggle */}
        <ThemeToggle />

        {user ? (
          <>
            {/* User Badge */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 14px",
              background: "var(--glass-bg)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
            }}>
              <div style={{
                width: "28px", height: "28px",
                background: "linear-gradient(135deg, #2874f0, #ff9900)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "900",
                fontSize: "11px",
                boxShadow: "0 2px 8px rgba(40,116,240,0.4)",
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "var(--text-primary)",
              }}>
                {user.name?.split(" ")[0]}
              </span>
            </div>

            <button
              onClick={logout}
              style={{
                padding: "8px 16px",
                background: "var(--error-bg)",
                color: "var(--error-text)",
                border: "1px solid var(--error-border)",
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "var(--transition-smooth)",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="btn-secondary"
              style={{ padding: "8px 18px", fontSize: "0.85rem" }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.85rem" }}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;