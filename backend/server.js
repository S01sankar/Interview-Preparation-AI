require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

// Route imports
const authRoutes      = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const reportRoutes    = require("./routes/reportRoutes");
const projectRoutes   = require("./routes/projectRoutes");
const debateRoutes    = require("./routes/debateRoutes");
const careerRoutes    = require("./routes/careerRoutes");

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = http.createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "https://prepai-interview.netlify.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "https://prepai-interview.netlify.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth",      authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/report",    reportRoutes);
app.use("/api/project",   projectRoutes);
app.use("/api/debate",    debateRoutes);
app.use("/api/career",    careerRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "PrepAI Backend is running ✅" });
});

// Global error handler
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large. Max size is 5MB." });
  }
  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({ message: err.message });
  }
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// Socket.io events
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    console.log(`📌 Joined session: ${sessionId}`);
  });

  socket.on("processing", (sessionId) => {
    io.to(sessionId).emit("processing", { status: "Processing your answer..." });
  });

  socket.on("transcription-done", ({ sessionId, transcript }) => {
    io.to(sessionId).emit("transcription-done", { transcript });
  });

  socket.on("scoring-done", ({ sessionId, scoreData }) => {
    io.to(sessionId).emit("scoring-done", { scoreData });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 PrepAI server running on port ${PORT}`);
});