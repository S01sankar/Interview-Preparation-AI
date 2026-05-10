const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadResume,
  generateQuestions,
  transcribeAudio,
  scoreAnswer,
  completeSession,
} = require("../controllers/interviewController");

// Multer config for PDF resume
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}-${file.originalname}`);
  },
});

const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Multer config for audio
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, `audio-${Date.now()}.webm`);
  },
});

const audioUpload = multer({
  storage: audioStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

// Routes
router.post("/upload-resume",      protect, resumeUpload.single("resume"), uploadResume);
router.post("/generate-questions", protect, generateQuestions);
router.post("/transcribe",         protect, audioUpload.single("audio"), transcribeAudio);
router.post("/score-answer",       protect, scoreAnswer);
router.post("/complete-session",   protect, completeSession);

module.exports = router;