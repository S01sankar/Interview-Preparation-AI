const openai = require("../config/openai");

// @desc    Start a debate topic
// @route   POST /api/debate/start
// @access  Protected
const startDebate = async (req, res) => {
  try {
    const { topic, jobRole } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const prompt = `You are an expert technical interviewer and debate opponent for a ${jobRole || "Software Engineer"} interview.
The candidate wants to debate this topic: "${topic}"

Start the debate by:
1. Taking a strong opposing position
2. Asking one challenging cross-question

Respond ONLY with valid JSON. No extra text.
Format:
{
  "opponentPosition": "<your strong opposing stance in 2-3 sentences>",
  "openingArgument": "<your opening argument in 3-4 sentences>",
  "crossQuestion": "<one sharp challenging question to the candidate>"
}`;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    let debateData;
    try {
      debateData = JSON.parse(
        completion.choices[0].message.content.trim()
      );
    } catch {
      return res.status(500).json({
        message: "Failed to parse debate response",
      });
    }

    res.status(200).json({
      message: "Debate started",
      debate: debateData,
    });
  } catch (error) {
    console.error("Start debate error:", error.message);
    res.status(500).json({ message: "Failed to start debate" });
  }
};

// @desc    Continue debate with user response
// @route   POST /api/debate/respond
// @access  Protected
const respondDebate = async (req, res) => {
  try {
    const { topic, jobRole, history, userArgument } = req.body;

    if (!topic || !userArgument) {
      return res.status(400).json({
        message: "Topic and argument are required",
      });
    }

    // Build conversation history
    const messages = [
      {
        role: "system",
        content: `You are an expert technical debate opponent for a ${jobRole || "Software Engineer"} interview.
You are debating the topic: "${topic}".
Be challenging, sharp and technical. Push the candidate to think deeper.
After responding to their argument, always ask one sharp cross-question.
Score their argument quality out of 10 after each response.`,
      },
    ];

    // Add history
    (history || []).forEach((msg) => {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      });
    });

    // Add current user argument
    messages.push({
      role: "user",
      content: userArgument,
    });

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 600,
    });

    const responseText = completion.choices[0].message.content.trim();

    // Score the argument
    const scorePrompt = `Rate this debate argument out of 10 for a ${jobRole || "Software Engineer"} technical debate on "${topic}".
Argument: "${userArgument}"
Respond ONLY with valid JSON. No extra text.
Format: { "score": <1-10>, "feedback": "<one sentence feedback>" }`;

    const scoreCompletion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: scorePrompt }],
      temperature: 0.4,
      max_tokens: 100,
    });

    let scoreData = { score: 7, feedback: "Good argument!" };
    try {
      scoreData = JSON.parse(
        scoreCompletion.choices[0].message.content.trim()
      );
    } catch {
      console.log("Score parse fallback");
    }

    res.status(200).json({
      message: "Debate response generated",
      response: responseText,
      score: scoreData.score,
      feedback: scoreData.feedback,
    });
  } catch (error) {
    console.error("Debate respond error:", error.message);
    res.status(500).json({ message: "Failed to generate response" });
  }
};

// @desc    End debate and get final score
// @route   POST /api/debate/end
// @access  Protected
const endDebate = async (req, res) => {
  try {
    const { topic, jobRole, scores } = req.body;

    const avgScore = scores.length > 0
      ? parseFloat(
          (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
        )
      : 0;

    const prompt = `A candidate just completed a technical debate on "${topic}" for a ${jobRole || "Software Engineer"} role.
Their average argument score was ${avgScore}/10 across ${scores.length} arguments.
Give a final debate performance summary.
Respond ONLY with valid JSON. No extra text.
Format:
{
  "overallScore": ${avgScore},
  "grade": "<Excellent|Good|Average|Needs Improvement>",
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<improvement1>", "<improvement2>"],
  "summary": "<2-3 sentence overall summary of the debate performance>"
}`;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 400,
    });

    let finalData;
    try {
      finalData = JSON.parse(
        completion.choices[0].message.content.trim()
      );
    } catch {
      finalData = {
        overallScore: avgScore,
        grade: avgScore >= 8 ? "Excellent" : avgScore >= 6 ? "Good" : "Average",
        strengths: ["Participated actively"],
        improvements: ["Practice more technical arguments"],
        summary: "Good effort in the debate!",
      };
    }

    res.status(200).json({
      message: "Debate ended",
      result: finalData,
    });
  } catch (error) {
    console.error("End debate error:", error.message);
    res.status(500).json({ message: "Failed to end debate" });
  }
};

module.exports = { startDebate, respondDebate, endDebate };