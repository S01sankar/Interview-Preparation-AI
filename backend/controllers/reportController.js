const Session = require("../models/Session");

// @desc    Get all sessions for logged-in user
// @route   GET /api/report/my-sessions
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user._id,
      status: "completed",
    })
      .select("jobRole status answers createdAt")
      .sort({ createdAt: -1 });

    const sessionSummaries = sessions.map((session) => {
      const totalAnswers = session.answers.length;
      const overallAvg =
        totalAnswers > 0
          ? parseFloat(
              (session.answers.reduce((acc, ans) => acc + ans.overall, 0) / totalAnswers).toFixed(1)
            )
          : 0;

      return {
        id: session._id,
        jobRole: session.jobRole,
        status: session.status,
        overallScore: overallAvg,
        totalQuestions: totalAnswers,
        createdAt: session.createdAt,
      };
    });

    res.status(200).json({
      message: "Sessions fetched successfully",
      sessions: sessionSummaries,
    });
  } catch (error) {
    console.error("Get sessions error:", error.message);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

// @desc    Get single session detail
// @route   GET /api/report/session/:id
const getSessionById = async (req, res) => {
  try {
    console.log("Looking for session ID:", req.params.id);
    
    const session = await Session.findById(req.params.id);

    console.log("Session found:", session);
    console.log("Session userId:", session?.userId);
    console.log("Request userId:", req.user._id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalAnswers = session.answers.length;
    const avgScores = { technical: 0, clarity: 0, relevance: 0, structure: 0 };

    if (totalAnswers > 0) {
      session.answers.forEach((ans) => {
        avgScores.technical += ans.scores.technical;
        avgScores.clarity   += ans.scores.clarity;
        avgScores.relevance += ans.scores.relevance;
        avgScores.structure += ans.scores.structure;
      });
      Object.keys(avgScores).forEach((key) => {
        avgScores[key] = parseFloat((avgScores[key] / totalAnswers).toFixed(1));
      });
    }

    const overallAverage =
      totalAnswers > 0
        ? parseFloat(
            (session.answers.reduce((acc, ans) => acc + ans.overall, 0) / totalAnswers).toFixed(1)
          )
        : 0;

    res.status(200).json({
      message: "Session fetched successfully",
      session: {
        id: session._id,
        jobRole: session.jobRole,
        status: session.status,
        questions: session.questions,
        answers: session.answers,
        averageScores: avgScores,
        overallAverage,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    console.error("Get session error:", error.message);
    res.status(500).json({ message: "Failed to fetch session details" });
  }
};

module.exports = { getMySessions, getSessionById };