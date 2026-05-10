const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { explainProject } = require("../controllers/projectController");

// POST /api/project/explain
router.post("/explain", protect, explainProject);

module.exports = router;