const Leaderboard = require("../models/Leaderboard");
const Session = require("../models/Session");

// @desc    Save score to leaderboard
// @route   POST /api/report/leaderboard
// @access  Protected
const saveToLeaderboard = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "completed") {
      return res.status(400).json({ message: "Session is not completed yet" });
    }

    // Calculate overall score
    const totalAnswers = session.answers.length;
    const overallScore = parseFloat(
      (
        session.answers.reduce((acc, ans) => acc + ans.overall, 0) /
        totalAnswers
      ).toFixed(1)
    );

    // Check if already saved
    const existing = await Leaderboard.findOne({
      sessionId,
      userId: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "This session is already on the leaderboard",
      });
    }

    // Save to leaderboard
    const entry = await Leaderboard.create({
      userId: req.user._id,
      userName: req.user.name,
      jobRole: session.jobRole,
      overallScore,
      sessionId,
    });

    res.status(201).json({
      message: "Score saved to leaderboard!",
      entry,
    });
  } catch (error) {
    console.error("Save leaderboard error:", error.message);
    res.status(500).json({ message: "Failed to save to leaderboard" });
  }
};

// @desc    Get top leaderboard scores
// @route   GET /api/report/leaderboard
// @access  Protected
const getLeaderboard = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { jobRole: role } : {};

    const entries = await Leaderboard.find(filter)
      .sort({ overallScore: -1 })
      .limit(20)
      .select("userName jobRole overallScore createdAt userId");

    // Mark current user entries
    const leaderboard = entries.map((entry, index) => ({
      rank: index + 1,
      userName: entry.userName,
      jobRole: entry.jobRole,
      overallScore: entry.overallScore,
      createdAt: entry.createdAt,
      isCurrentUser:
        entry.userId.toString() === req.user._id.toString(),
    }));

    res.status(200).json({
      message: "Leaderboard fetched successfully",
      leaderboard,
    });
  } catch (error) {
    console.error("Get leaderboard error:", error.message);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

module.exports = { saveToLeaderboard, getLeaderboard };