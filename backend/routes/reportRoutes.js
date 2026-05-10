const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMySessions,
  getSessionById,
} = require("../controllers/reportController");
const { sendEmailReport } = require("../controllers/emailController");
const {
  saveToLeaderboard,
  getLeaderboard,
} = require("../controllers/leaderboardController");

// Sessions
router.get("/my-sessions", protect, getMySessions);
router.get("/session/:id", protect, getSessionById);

// Email
router.post("/send-email", protect, sendEmailReport);

// Leaderboard
router.get("/leaderboard", protect, getLeaderboard);
router.post("/leaderboard", protect, saveToLeaderboard);

module.exports = router;