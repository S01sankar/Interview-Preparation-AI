const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  jobRole:   String,
  averageScores: {
    technical: Number,
    clarity:   Number,
    relevance: Number,
    structure: Number,
  },
  overallAverage:        Number,
  strongestDimension:    String,
  weakestDimension:      String,
  improvementSuggestion: String,
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);