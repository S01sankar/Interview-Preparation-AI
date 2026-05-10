const openai = require("../config/openai");

// @desc    Generate AI project explanation
// @route   POST /api/project/explain
// @access  Protected
const explainProject = async (req, res) => {
  try {
    const { projectName, techStack, description } = req.body;

    if (!projectName || !techStack) {
      return res.status(400).json({
        message: "Project name and tech stack are required",
      });
    }

    const prompt = `You are an expert software engineer and technical mentor.
A student has built a project and needs a professional explanation for interviews and presentations.

Project Name: "${projectName}"
Tech Stack: "${techStack}"
Description: "${description || "Not provided"}"

Generate a complete professional project explanation.
Respond ONLY with valid JSON. No extra text.
Format:
{
  "overview": "<3 sentence professional overview of the project>",
  "architecture": "<explain the system architecture in 3-4 sentences>",
  "workflow": "<step by step workflow of how the project works, 4-5 steps>",
  "keyFeatures": ["<feature1>", "<feature2>", "<feature3>", "<feature4>"],
  "techExplanation": "<why this tech stack was chosen, 2-3 sentences>",
  "challenges": "<common challenges in this type of project and how to address them>",
  "vivaQuestions": [
    { "question": "<viva question 1>", "answer": "<short answer>" },
    { "question": "<viva question 2>", "answer": "<short answer>" },
    { "question": "<viva question 3>", "answer": "<short answer>" },
    { "question": "<viva question 4>", "answer": "<short answer>" },
    { "question": "<viva question 5>", "answer": "<short answer>" }
  ],
  "presentationTips": ["<tip1>", "<tip2>", "<tip3>"]
}`;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0].message.content.trim();

    let projectData;
    try {
      projectData = JSON.parse(responseText);
    } catch {
      return res.status(500).json({
        message: "Failed to parse AI response",
      });
    }

    res.status(200).json({
      message: "Project explanation generated successfully",
      project: projectData,
    });
  } catch (error) {
    console.error("Project explain error:", error.message);
    res.status(500).json({ message: "Failed to generate explanation" });
  }
};

module.exports = { explainProject };