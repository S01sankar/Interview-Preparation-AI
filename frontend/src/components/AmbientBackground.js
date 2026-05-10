import React from "react";

const AmbientBackground = () => {
  return (
    <>
      {/* Premium gradient background */}
      <div className="premium-bg">

        {/* Main gradient orbs */}
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />

        {/* Extra mid orb — blue top right */}
        <div style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle at 40% 40%, rgba(40,116,240,0.2) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "floatOrb 10s ease-in-out infinite 2s",
          borderRadius: "50%",
        }} />

        {/* Extra mid orb — orange bottom left */}
        <div style={{
          position: "absolute",
          bottom: "20%",
          left: "15%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle at 60% 60%, rgba(255,153,0,0.18) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "floatOrb 14s ease-in-out infinite 4s",
          borderRadius: "50%",
        }} />

        {/* Liquid Glass Shape 1 — top left organic blob */}
        <svg
          className="liquid-shape"
          style={{
            top: "8%",
            left: "5%",
            width: "280px",
            height: "280px",
            animationDuration: "15s",
          }}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2874f0" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ff9900" stopOpacity="0.08" />
            </linearGradient>
            <filter id="blur1">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <path
            fill="url(#lg1)"
            filter="url(#blur1)"
            d="M47.1,-57.1C59.5,-45.6,67.2,-28.4,68.5,-11.1C69.8,6.2,64.7,23.6,54.8,37.2C44.9,50.8,30.2,60.6,13.4,65.4C-3.4,70.2,-22.3,70,-37.6,62.1C-52.9,54.2,-64.6,38.6,-69.1,21.1C-73.6,3.6,-70.8,-15.8,-61.3,-30.5C-51.8,-45.2,-35.5,-55.2,-19.4,-62.3C-3.3,-69.4,12.6,-73.6,27.1,-69.5C41.6,-65.4,34.7,-68.6,47.1,-57.1Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Liquid Glass Shape 2 — bottom right organic blob */}
        <svg
          className="liquid-shape"
          style={{
            bottom: "10%",
            right: "8%",
            width: "320px",
            height: "320px",
            animationDuration: "18s",
            animationName: "liquidFloat2",
          }}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9900" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#26a541" stopOpacity="0.08" />
            </linearGradient>
            <filter id="blur2">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          <path
            fill="url(#lg2)"
            filter="url(#blur2)"
            d="M39.9,-47.5C52.4,-36.7,63.5,-24.1,67.2,-9.1C70.9,5.9,67.1,23.3,57.5,36.2C47.9,49.1,32.5,57.5,16.1,62.3C-0.3,67.1,-17.7,68.3,-32.8,62.1C-47.9,55.9,-60.7,42.3,-66.1,26.4C-71.5,10.5,-69.5,-7.7,-62,-23.1C-54.5,-38.5,-41.5,-51.1,-27.4,-60.8C-13.3,-70.5,1.9,-77.3,15.8,-73.7C29.7,-70.1,27.4,-58.3,39.9,-47.5Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Liquid Glass Shape 3 — mid left floating */}
        <svg
          className="liquid-shape"
          style={{
            top: "40%",
            left: "2%",
            width: "200px",
            height: "200px",
            animationDuration: "20s",
            animationName: "liquidFloat3",
          }}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lg3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#26a541" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2874f0" stopOpacity="0.06" />
            </linearGradient>
            <filter id="blur3">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          <path
            fill="url(#lg3)"
            filter="url(#blur3)"
            d="M53.4,-64.6C67.4,-51.9,75.7,-33.2,76.3,-14.9C76.9,3.4,69.8,21.3,59.3,35.8C48.8,50.3,34.9,61.4,18.9,67.3C2.9,73.2,-15.2,73.9,-30.7,67.5C-46.2,61.1,-59.1,47.6,-67.2,31.4C-75.3,15.2,-78.6,-3.7,-73.8,-20.1C-69,-36.5,-56.1,-50.4,-41.5,-62.7C-26.9,-75,-10.6,-85.7,5.8,-82.7C22.2,-79.7,39.4,-77.3,53.4,-64.6Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Liquid Glass Shape 4 — top right floating */}
        <svg
          className="liquid-shape"
          style={{
            top: "20%",
            right: "5%",
            width: "240px",
            height: "240px",
            animationDuration: "16s",
            opacity: 0.4,
          }}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lg4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2874f0" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#ff9900" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#26a541" stopOpacity="0.05" />
            </linearGradient>
            <filter id="blur4">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <path
            fill="url(#lg4)"
            filter="url(#blur4)"
            d="M42.7,-51.2C55.1,-40.1,64.8,-25.3,67.6,-9.1C70.4,7.1,66.3,24.7,56.7,38.1C47.1,51.5,32,60.7,15.5,66.1C-1,71.5,-19,73.1,-34.1,66.9C-49.2,60.7,-61.4,46.7,-67.4,30.5C-73.4,14.3,-73.2,-4.1,-66.3,-19.4C-59.4,-34.7,-45.8,-46.9,-31.7,-57.5C-17.6,-68.1,2,-77.1,18.3,-74.2C34.6,-71.3,30.3,-62.3,42.7,-51.2Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Liquid Glass Shape 5 — center bottom floating */}
        <svg
          className="liquid-shape"
          style={{
            bottom: "5%",
            left: "35%",
            width: "260px",
            height: "260px",
            animationDuration: "22s",
            animationName: "liquidFloat2",
            opacity: 0.35,
          }}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lg5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9900" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2874f0" stopOpacity="0.08" />
            </linearGradient>
            <filter id="blur5">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>
          <path
            fill="url(#lg5)"
            filter="url(#blur5)"
            d="M46.5,-54.5C58.8,-43.2,66.4,-26.5,68.1,-9.4C69.8,7.7,65.6,25.2,56.1,38.8C46.6,52.4,31.8,62.1,15.5,67.4C-0.8,72.7,-18.6,73.6,-33.8,67C-49,60.4,-61.6,46.3,-68.3,29.8C-75,13.3,-75.8,-5.6,-69.5,-21.5C-63.2,-37.4,-49.8,-50.3,-35.4,-61.3C-21,-72.3,-5.5,-81.4,9.3,-79.4C24.1,-77.4,34.2,-65.8,46.5,-54.5Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Dot Grid Pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, var(--border-color) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.4,
        }} />

        {/* Diagonal gradient overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(40,116,240,0.03) 0%, transparent 40%, rgba(255,153,0,0.03) 100%)",
        }} />
      </div>
    </>
  );
};

export default AmbientBackground;