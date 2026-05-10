import React, { useEffect, useRef, useState } from "react";

// Draggable Card Component
const DraggableCard = ({ children, initialX, initialY, zIndex = 1 }) => {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const onMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging) return;
      setPos({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };

    const onMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, offset]);

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: dragging ? 999 : zIndex,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        transition: dragging ? "none" : "box-shadow 0.3s ease",
        boxShadow: dragging
          ? "0 24px 60px rgba(40,116,240,0.4)"
          : "0 8px 32px rgba(40,116,240,0.15)",
      }}
    >
      {children}
    </div>
  );
};

// Interactive Leaf that follows cursor
const InteractiveLeaf = ({ x, y, size, color, delay, shape }) => {
  const [pos, setPos] = useState({ x, y });
  const [target, setTarget] = useState({ x, y });
  const animRef = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      // Leaves gently drift toward cursor
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 300) {
        setTarget({
          x: pos.x + dx * 0.02,
          y: pos.y + dy * 0.02,
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [pos]);

  useEffect(() => {
    let frame;
    const animate = () => {
      setPos((prev) => ({
        x: prev.x + (target.x - prev.x) * 0.05,
        y: prev.y + (target.y - prev.y) * 0.05,
      }));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const shapes = {
    leaf1: "M50,5 C70,5 90,20 90,45 C90,70 70,90 50,95 C30,90 10,70 10,45 C10,20 30,5 50,5 Z",
    leaf2: "M50,2 L95,50 L50,98 L5,50 Z",
    leaf3: "M50,5 C80,5 95,30 95,50 C95,80 70,95 50,95 C20,95 5,70 5,45 C5,20 20,5 50,5 Z",
    blob1: "M47,-57 C59,-46 67,-28 68,-11 C70,6 65,24 55,37 C45,51 30,61 13,65 C-3,70 -22,70 -38,62 C-53,54 -65,39 -69,21 C-74,4 -71,-16 -61,-31 C-52,-45 -36,-55 -19,-62 C-3,-69 13,-74 27,-70 C41,-65 35,-68 47,-57 Z",
    blob2: "M40,-48 C52,-37 65,-24 68,-9 C71,6 64,23 54,37 C44,51 29,61 12,66 C-5,71 -24,71 -39,63 C-54,55 -65,39 -68,22 C-71,5 -66,-13 -56,-28 C-46,-43 -31,-55 -15,-62 C1,-69 18,-71 33,-66 C48,-61 28,-59 40,-48 Z",
  };

  return (
    <svg
      style={{
        position: "fixed",
        left: `${pos.x - size / 2}px`,
        top: `${pos.y - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.5,
        transform: `rotate(${delay * 30}deg)`,
        transition: "opacity 0.3s ease",
        filter: "blur(1px)",
      }}
      viewBox="-100 -100 200 200"
    >
      <defs>
        <linearGradient id={`leafGrad${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
        <filter id={`leafBlur${delay}`}>
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <path
        d={shapes[shape] || shapes.leaf1}
        fill={`url(#leafGrad${delay})`}
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.3"
      />
    </svg>
  );
};

// 3D Resume Card
const Resume3D = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 12;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 12;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={(e) => { setHovering(true); handleMouseMove(e); }}
      onMouseLeave={handleMouseLeave}
      style={{
        width: "320px",
        perspective: "1000px",
        cursor: "pointer",
      }}
    >
      <div style={{
        width: "100%",
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${hovering ? "scale(1.03)" : "scale(1)"}`,
        transition: hovering ? "none" : "transform 0.5s ease",
        transformStyle: "preserve-3d",
        borderRadius: "16px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.98) 100%)",
        boxShadow: hovering
          ? `${-rotation.y * 2}px ${rotation.x * 2}px 60px rgba(40,116,240,0.4), 0 30px 80px rgba(0,0,0,0.2)`
          : "0 20px 60px rgba(40,116,240,0.2), 0 8px 24px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.8)",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Mirror/glass reflection overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            ${135 + rotation.y}deg,
            rgba(255,255,255,0.4) 0%,
            rgba(255,255,255,0.0) 40%,
            rgba(255,255,255,0.15) 100%
          )`,
          pointerEvents: "none",
          zIndex: 2,
          borderRadius: "16px",
        }} />

        {/* Resume Content */}
        <div style={{ padding: "24px", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #2874f0, #1a4faa)",
            margin: "-24px -24px 16px",
            padding: "20px 24px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: "-20px", right: "-20px",
              width: "80px", height: "80px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }} />
            <h2 style={{
              color: "#fff",
              fontWeight: "900",
              fontSize: "1.2rem",
              margin: "0 0 2px",
              fontFamily: "Georgia, serif",
            }}>
              SIVA
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.75rem",
              margin: 0,
              fontWeight: "600",
            }}>
              Frontend Developer
            </p>
          </div>

          {/* Score Badge */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
          }}>
            <span style={{
              fontSize: "0.7rem",
              color: "#555",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              Resume Score
            </span>
            <div style={{
              display: "flex",
              alignItems: "baseline",
              gap: "2px",
            }}>
              <span style={{
                fontSize: "1.8rem",
                fontWeight: "900",
                color: "#26a541",
              }}>82</span>
              <span style={{ color: "#888", fontSize: "0.9rem" }}>/100</span>
            </div>
          </div>

          {/* Score Bars */}
          {[
            { label: "Contact Info", score: 95, color: "#26a541" },
            { label: "Work Experience", score: 82, color: "#2874f0" },
            { label: "Skills", score: 75, color: "#ff9900" },
            { label: "Education", score: 88, color: "#26a541" },
            { label: "ATS Keywords", score: 60, color: "#e47911" },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: "8px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "3px",
              }}>
                <span style={{ fontSize: "0.68rem", color: "#555", fontWeight: "600" }}>
                  {item.label}
                </span>
                <span style={{ fontSize: "0.68rem", color: item.color, fontWeight: "700" }}>
                  {item.score}%
                </span>
              </div>
              <div style={{
                height: "4px",
                backgroundColor: "#f0f0f0",
                borderRadius: "2px",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${item.score}%`,
                  backgroundColor: item.color,
                  borderRadius: "2px",
                  boxShadow: `0 0 6px ${item.color}80`,
                }} />
              </div>
            </div>
          ))}

          {/* Bottom badges */}
          <div style={{
            display: "flex",
            gap: "6px",
            marginTop: "12px",
            flexWrap: "wrap",
          }}>
            {["React", "Node.js", "MongoDB", "AWS"].map((skill) => (
              <span key={skill} style={{
                backgroundColor: "rgba(40,116,240,0.08)",
                color: "#2874f0",
                border: "1px solid rgba(40,116,240,0.2)",
                padding: "2px 8px",
                borderRadius: "20px",
                fontSize: "0.65rem",
                fontWeight: "700",
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom shine */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #2874f0, #ff9900, #26a541)",
        }} />
      </div>
    </div>
  );
};

// Floating Stats Card
const FloatingCard = ({ title, value, sub, color, delay }) => {
  return (
    <div style={{
      backgroundColor: "var(--glass-bg)",
      backdropFilter: "blur(20px)",
      border: "1px solid var(--glass-border)",
      borderRadius: "14px",
      padding: "14px 18px",
      boxShadow: `0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.1)`,
      animation: `floatCard 4s ease-in-out infinite ${delay}s`,
      position: "relative",
      overflow: "hidden",
      minWidth: "140px",
    }}>
      {/* Shine */}
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        width: "50%", height: "40%",
        background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
        borderRadius: "14px 0 0 0",
        pointerEvents: "none",
      }} />

      <div style={{
        fontSize: "1.6rem",
        fontWeight: "900",
        color: color,
        lineHeight: 1,
        marginBottom: "4px",
      }}>
        {value}
      </div>
      <div style={{
        fontSize: "0.75rem",
        color: "var(--text-primary)",
        fontWeight: "700",
        marginBottom: "2px",
      }}>
        {title}
      </div>
      <div style={{
        fontSize: "0.65rem",
        color: "var(--text-muted)",
      }}>
        {sub}
      </div>

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

const InteractiveLanding = () => {
  const leaves = [
    { x: 100, y: 200, size: 120, color: "#2874f0", delay: 0, shape: "blob1" },
    { x: window.innerWidth - 150, y: 300, size: 160, color: "#ff9900", delay: 1, shape: "blob2" },
    { x: 200, y: window.innerHeight - 200, size: 100, color: "#26a541", delay: 2, shape: "leaf3" },
    { x: window.innerWidth - 200, y: 150, size: 140, color: "#2874f0", delay: 3, shape: "blob1" },
    { x: window.innerWidth / 2, y: 100, size: 90, color: "#ff9900", delay: 4, shape: "leaf2" },
  ];

  return (
    <>
      {/* Interactive cursor leaves */}
      {leaves.map((leaf, i) => (
        <InteractiveLeaf key={i} {...leaf} />
      ))}

      {/* Draggable floating cards */}
      <DraggableCard initialX={40} initialY={120} zIndex={10}>
        <FloatingCard
          title="Resume Score"
          value="82"
          sub="Above average"
          color="#26a541"
          delay={0}
        />
      </DraggableCard>

      <DraggableCard initialX={window.innerWidth - 220} initialY={200} zIndex={10}>
        <FloatingCard
          title="Interview Score"
          value="8.4"
          sub="Out of 10"
          color="#2874f0"
          delay={1}
        />
      </DraggableCard>

      <DraggableCard initialX={60} initialY={window.innerHeight - 300} zIndex={10}>
        <FloatingCard
          title="Aura Score"
          value="9.1"
          sub="Magnetic presence"
          color="#ff9900"
          delay={2}
        />
      </DraggableCard>

      <DraggableCard initialX={window.innerWidth - 200} initialY={window.innerHeight - 280} zIndex={10}>
        <FloatingCard
          title="Career Ready"
          value="94%"
          sub="Placement probability"
          color="#26a541"
          delay={0.5}
        />
      </DraggableCard>
    </>
  );
};

export { Resume3D, InteractiveLanding, DraggableCard, FloatingCard };