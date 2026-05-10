const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  startDebate,
  respondDebate,
  endDebate,
} = require("../controllers/debateController");

// POST /api/debate/start
router.post("/start", protect, startDebate);

// POST /api/debate/respond
router.post("/respond", protect, respondDebate);

// POST /api/debate/end
router.post("/end", protect, endDebate);

module.exports = router;