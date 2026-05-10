const fs = require("fs");
const path = require("path");
const { PdfReader } = require("pdfreader");
const openai = require("../config/openai");
const Session = require("../models/Session");

// @desc    Upload resume and extract text
// @route   POST /api/interview/upload-resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const filePath = req.file.path;

    // Extract text from PDF using pdfreader
    const extractText = () => {
      return new Promise((resolve, reject) => {
        let text = "";
        new PdfReader().parseFileItems(filePath, (err, item) => {
          if (err) {
            reject(err);
          } else if (!item) {
            // End of file
            resolve(text.trim());
          } else if (item.text) {
            text += item.text + " ";
          }
        });
      });
    };

    const resumeText = await extractText();

    // Delete temp file immediately
    fs.unlinkSync(filePath);

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ message: "Could not extract text from PDF" });
    }

    res.status(200).json({
      message: "Resume parsed successfully",
      resumeText,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Resume upload error:", error.message);
    res.status(500).json({ message: "Failed to process resume" });
  }
};
// @desc    Generate questions via GPT-3.5 turbo
// @route   POST /api/interview/generate-questions
const generateQuestions = async (req, res) => {
  try {
    const { jobRole, resumeText } = req.body;

    if (!jobRole || !resumeText) {
      return res.status(400).json({ message: "Job role and resume text are required" });
    }

    const sanitizedResume = resumeText.replace(/[<>{}]/g, "").slice(0, 3000);

    const pressureLevel = req.body.pressureMode ? "high" : "normal";

    const prompt = `You are an expert technical interviewer for the role of "${jobRole}".
    Based on the following resume, generate exactly 5 personalized interview questions.
    ${pressureLevel === "high"
      ? "This is a HIGH PRESSURE interview. Make questions very challenging, deeply technical, and include tricky edge cases. The interviewer is aggressive and expects precise answers."
      : "Mix technical questions with behavioral and situational ones."
    }

    Resume:
    ${sanitizedResume}

    Respond ONLY with a valid JSON array of 5 strings. No extra text.
    Example: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
});

    const responseText = completion.choices[0].message.content.trim();

    let questions;
    try {
      questions = JSON.parse(responseText);
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid format");
      }
    } catch {
      return res.status(500).json({ message: "Failed to parse AI questions" });
    }

    const session = await Session.create({
      userId: req.user._id,
      jobRole,
      resumeText: sanitizedResume,
      questions,
      status: "active",
    });

    res.status(201).json({
      message: "Questions generated successfully",
      sessionId: session._id,
      questions,
    });
  } catch (error) {
    console.error("Generate questions error:", error.message);
    res.status(500).json({ message: "Failed to generate questions" });
  }
};

// @desc    Transcribe audio via Whisper
// @route   POST /api/interview/transcribe
const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const filePath = req.file.path;

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      language: "en",
    });

    fs.unlinkSync(filePath);

    const transcript = transcription.text.trim();

    if (!transcript) {
      return res.status(400).json({ message: "Could not transcribe audio" });
    }

    res.status(200).json({
      message: "Transcription successful",
      transcript,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Transcription error:", error.message);
    res.status(500).json({ message: "Failed to transcribe audio" });
  }
};

// @desc    Score answer via GPT-3.5 turbo
// @route   POST /api/interview/score-answer
const scoreAnswer = async (req, res) => {
  try {
    const { sessionId, question, transcript, jobRole } = req.body;

    if (!sessionId || !question || !transcript || !jobRole) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isPressure = req.body.pressureMode || false;

    const prompt = `You are an expert interviewer for the role of "${jobRole}".
    ${isPressure
      ? "This is a HIGH PRESSURE interview. Be strict, demanding and critical in your scoring. Deduct points for vague or incomplete answers."
      : "Be fair and constructive in your scoring."
    }

    Question: "${question}"
    Candidate's Answer: "${transcript}"

    Score the answer across 4 dimensions out of 10:
    1. Technical Accuracy
    2. Communication Clarity
    3. Answer Relevance
    4. Structure & Depth

    Respond ONLY with a valid JSON object. No extra text.
    Format:
    {
      "scores": {
        "technical": <1-10>,
        "clarity": <1-10>,
        "relevance": <1-10>,
        "structure": <1-10>
      },
      "overall": <average to 1 decimal>,
      "feedback": "<one sentence of actionable feedback>",
      "pressureFeedback": "${isPressure ? "<one harsh but constructive line about what was missing>" : ""}"
    }`;
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 400,
    });

    const responseText = completion.choices[0].message.content.trim();

    let scoreData;
    try {
      scoreData = JSON.parse(responseText);
      if (!scoreData.scores || typeof scoreData.overall !== "number") {
        throw new Error("Invalid score format");
      }
    } catch {
      return res.status(500).json({ message: "Failed to parse scoring response" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.answers.push({
      question,
      transcript,
      scores: scoreData.scores,
      overall: scoreData.overall,
      feedback: scoreData.feedback,
    });

    await session.save();

    res.status(200).json({
      message: "Answer scored successfully",
      scores: scoreData.scores,
      overall: scoreData.overall,
      feedback: scoreData.feedback,
    });
  } catch (error) {
    console.error("Score answer error:", error.message);
    res.status(500).json({ message: "Failed to score answer" });
  }
};

// @desc    Complete session
// @route   POST /api/interview/complete-session
const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const totalAnswers = session.answers.length;
    const avgScores = { technical: 0, clarity: 0, relevance: 0, structure: 0 };

    session.answers.forEach((ans) => {
      avgScores.technical += ans.scores.technical;
      avgScores.clarity   += ans.scores.clarity;
      avgScores.relevance += ans.scores.relevance;
      avgScores.structure += ans.scores.structure;
    });

    Object.keys(avgScores).forEach((key) => {
      avgScores[key] = parseFloat((avgScores[key] / totalAnswers).toFixed(1));
    });

    const overallAverage = parseFloat(
      (Object.values(avgScores).reduce((a, b) => a + b, 0) / 4).toFixed(1)
    );

    const sorted = Object.entries(avgScores).sort((a, b) => b[1] - a[1]);
    const strongestDimension = sorted[0][0];
    const weakestDimension   = sorted[sorted.length - 1][0];

    const suggestionPrompt = `A candidate completed an interview for "${session.jobRole}".
      Scores: Technical: ${avgScores.technical}, Clarity: ${avgScores.clarity}, Relevance: ${avgScores.relevance}, Structure: ${avgScores.structure}.
      Their weakest area is "${weakestDimension}".
      Write one specific actionable improvement suggestion (2-3 sentences) for their weakest area.`;

          const suggestionRes = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: suggestionPrompt }],
            temperature: 0.5,
            max_tokens: 150,
      });

    const improvementSuggestion = suggestionRes.choices[0].message.content.trim();
    // Generate Aura Score
    const auraPrompt = `You are an expert interview coach evaluating a candidate for "${session.jobRole}".
    Based on these average scores: Technical: ${avgScores.technical}, Clarity: ${avgScores.clarity}, Relevance: ${avgScores.relevance}, Structure: ${avgScores.structure}.
    Generate an Interview Aura Score out of 10 that reflects the candidate's overall interview presence, confidence, and professionalism.
    Respond ONLY with a valid JSON object. No extra text.
    Format: { "auraScore": <number 1-10 to 1 decimal>, "auraLabel": "<one word like Magnetic/Strong/Growing/Weak>", "auraFeedback": "<one sentence about their overall presence>" }`;

    const auraRes = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: auraPrompt }],
      temperature: 0.5,
      max_tokens: 150,
    });

    let auraData = { auraScore: overallAverage, auraLabel: "Good", auraFeedback: "" };
    try {
      auraData = JSON.parse(auraRes.choices[0].message.content.trim());
    } catch {
      console.log("Aura parse fallback used");
    }

        // Generate Personality Mirror
    const personalityPrompt = `You are an expert psychologist analysing a job interview for "${session.jobRole}".
    Based on these scores: Technical: ${avgScores.technical}, Clarity: ${avgScores.clarity}, Relevance: ${avgScores.relevance}, Structure: ${avgScores.structure}.
    Analyse the candidate's personality traits shown during the interview.
    Respond ONLY with valid JSON. No extra text.
    Format:
    {
      "traits": {
        "leadership": <1-10>,
        "analytical": <1-10>,
        "emotional": <1-10>,
        "confidence": <1-10>,
        "creativity": <1-10>
      },
      "dominantTrait": "<one trait name and short reason>",
      "summary": "<2 sentence personality summary>"
    }`;

    const personalityRes = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: personalityPrompt }],
      temperature: 0.6,
      max_tokens: 300,
    });

    let personalityData = null;
    try {
      personalityData = JSON.parse(
        personalityRes.choices[0].message.content.trim()
      );
    } catch {
      console.log("Personality parse fallback");
    }

        // Generate Future Interview Prediction
    const predictionPrompt = `You are an expert career coach predicting interview success for "${session.jobRole}".
    Scores: Technical: ${avgScores.technical}, Clarity: ${avgScores.clarity}, Relevance: ${avgScores.relevance}, Structure: ${avgScores.structure}.
    Overall: ${overallAverage}/10.
    Predict the candidate's interview success probability and placement risk.
    Respond ONLY with valid JSON. No extra text.
    Format:
    {
      "successProbability": <0-100 integer>,
      "riskLevel": "<Low|Medium|High>",
      "strengths": ["<strength1>", "<strength2>", "<strength3>"],
      "risks": ["<risk1>", "<risk2>"],
      "suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"]
    }`;

    const predictionRes = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: predictionPrompt }],
      temperature: 0.5,
      max_tokens: 400,
    });

    let predictionData = null;
    try {
      predictionData = JSON.parse(
        predictionRes.choices[0].message.content.trim()
      );
    } catch {
      console.log("Prediction parse fallback");
    }
    // Generate Project Ideas From Weakness
    const projectPrompt = `You are an expert mentor for a ${session.jobRole} candidate.
    Their weakest area is "${weakestDimension}" with a score of ${avgScores[weakestDimension]}/10.
    Suggest exactly 3 practical project ideas to strengthen this weakness.
    Respond ONLY with valid JSON array. No extra text.
    Format:
    [
      {
        "name": "<project name>",
        "description": "<2 sentence description>",
        "difficulty": "<Beginner|Intermediate|Advanced>",
        "techStack": ["<tech1>", "<tech2>", "<tech3>"],
        "timeline": "<e.g. 1-2 weeks>"
      }
    ]`;

    const projectRes = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: projectPrompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    let projectIdeas = null;
    try {
      projectIdeas = JSON.parse(
        projectRes.choices[0].message.content.trim()
      );
    } catch {
      console.log("Project ideas parse fallback");
    }


    session.status = "completed";
    await session.save();

    res.status(200).json({
      message: "Session completed",
      report: {
        sessionId: session._id,
        jobRole: session.jobRole,
        averageScores: avgScores,
        overallAverage,
        strongestDimension,
        weakestDimension,
        improvementSuggestion,
        totalQuestions: totalAnswers,
        auraScore: auraData.auraScore,
        auraLabel: auraData.auraLabel,
        auraFeedback: auraData.auraFeedback,
        personality: personalityData,
        prediction: predictionData,
        projectIdeas,
      },
    });
  } catch (error) {
    console.error("Complete session error:", error.message);
    res.status(500).json({ message: "Failed to complete session" });
  }
};

module.exports = {
  uploadResume,
  generateQuestions,
  transcribeAudio,
  scoreAnswer,
  completeSession,
};