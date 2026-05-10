const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question:   String,
  transcript: String,
  scores: {
    technical: Number,
    clarity:   Number,
    relevance: Number,
    structure: Number,
  },
  overall:  Number,
  feedback: String,
});

const sessionSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobRole:    { type: String, required: true },
  resumeText: { type: String, required: true },
  questions:  [String],
  answers:    [answerSchema],
  status:     { type: String, enum: ["active", "completed"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);