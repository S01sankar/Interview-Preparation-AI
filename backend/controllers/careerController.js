const openai = require("../config/openai");

// @desc    Generate career simulation
// @route   POST /api/career/simulate
// @access  Protected
const simulateCareer = async (req, res) => {
  try {
    const {
      currentRole,
      experience,
      skills,
      interests,
      targetRole,
      location,
    } = req.body;

    if (!currentRole || !skills) {
      return res.status(400).json({
        message: "Current role and skills are required",
      });
    }

    const prompt = `You are an expert career counselor and industry analyst.
Analyze this candidate's profile and generate a detailed career simulation.

Profile:
- Current Role: ${currentRole}
- Experience: ${experience || "Fresher"} years
- Skills: ${skills}
- Interests: ${interests || "Not specified"}
- Target Role: ${targetRole || "Not specified"}
- Location: ${location || "India"}

Generate a comprehensive 5-year career roadmap with predictions.
Respond ONLY with valid JSON. No extra text.
Format:
{
  "currentSalary": "<estimated current salary range>",
  "careerScore": <1-100 integer representing career readiness>,
  "summary": "<3 sentence career profile summary>",
  "roadmap": [
    {
      "year": "Year 1",
      "role": "<role title>",
      "salary": "<salary range>",
      "skills": ["<skill1>", "<skill2>", "<skill3>"],
      "milestone": "<key achievement for this year>",
      "probability": <60-95 integer>
    },
    {
      "year": "Year 2",
      "role": "<role title>",
      "salary": "<salary range>",
      "skills": ["<skill1>", "<skill2>", "<skill3>"],
      "milestone": "<key achievement for this year>",
      "probability": <60-95 integer>
    },
    {
      "year": "Year 3",
      "role": "<role title>",
      "salary": "<salary range>",
      "skills": ["<skill1>", "<skill2>", "<skill3>"],
      "milestone": "<key achievement for this year>",
      "probability": <60-95 integer>
    },
    {
      "year": "Year 5",
      "role": "<role title>",
      "salary": "<salary range>",
      "skills": ["<skill1>", "<skill2>", "<skill3>"],
      "milestone": "<key achievement for this year>",
      "probability": <60-95 integer>
    }
  ],
  "topSkillsToLearn": [
    { "skill": "<skill name>", "priority": "<High|Medium|Low>", "reason": "<why this skill>" }
  ],
  "industryTrends": ["<trend1>", "<trend2>", "<trend3>"],
  "riskFactors": ["<risk1>", "<risk2>"],
  "dreamRolePrediction": {
    "role": "<ultimate career goal role>",
    "timeframe": "<e.g. 5-7 years>",
    "salary": "<salary range>",
    "probability": <50-90 integer>
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 2000,
    });

    let careerData;

try {
  // Get AI response
  const rawResponse =
    completion.choices[0].message.content;

  // Print AI response in terminal
  console.log("RAW RESPONSE:");
  console.log(rawResponse);

  // Remove ```json and ```
  const cleanedResponse = rawResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // Convert string to JSON
  careerData = JSON.parse(cleanedResponse);

} catch (error) {

  console.log("JSON PARSE ERROR:");
  console.log(error);

  return res.status(500).json({
    message: "Failed to parse career simulation",
  });
}

    res.status(200).json({
      message: "Career simulation generated successfully",
      career: careerData,
    });
  } catch (error) {
    console.error("Career simulate error:", error.message);
    res.status(500).json({ message: "Failed to simulate career" });
  }
};

module.exports = { simulateCareer };