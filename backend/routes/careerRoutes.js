const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { simulateCareer } = require("../controllers/careerController");

// POST /api/career/simulate
router.post("/simulate", protect, simulateCareer);

module.exports = router;