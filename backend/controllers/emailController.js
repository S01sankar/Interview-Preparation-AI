const transporter = require("../config/email");
const Session = require("../models/Session");

// @desc    Send session report to email
// @route   POST /api/report/send-email
// @access  Protected
const sendEmailReport = async (req, res) => {
  try {
    const { sessionId, email } = req.body;

    if (!sessionId || !email) {
      return res.status(400).json({ message: "Session ID and email are required" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Calculate average scores
    const totalAnswers = session.answers.length;
    const avgScores = { technical: 0, clarity: 0, relevance: 0, structure: 0 };

    session.answers.forEach((ans) => {
      avgScores.technical += ans.scores.technical;
      avgScores.clarity   += ans.scores.clarity;
      avgScores.relevance += ans.scores.relevance;
      avgScores.structure += ans.scores.structure;
    });

    Object.keys(avgScores).forEach((key) => {
      avgScores[key] = parseFloat(
        (avgScores[key] / totalAnswers).toFixed(1)
      );
    });

    const overallAverage = parseFloat(
      (
        Object.values(avgScores).reduce((a, b) => a + b, 0) / 4
      ).toFixed(1)
    );

    const getScoreColor = (score) => {
      if (score >= 7) return "#16a34a";
      if (score >= 5) return "#d97706";
      return "#dc2626";
    };

    const getScoreEmoji = (score) => {
      if (score >= 8) return "🌟";
      if (score >= 7) return "💪";
      if (score >= 6) return "👍";
      if (score >= 5) return "📈";
      return "🔧";
    };

    // Build answers HTML
    const answersHTML = session.answers.map((ans, i) => `
      <div style="
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
        border: 1px solid #e5e7eb;
      ">
        <p style="
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px;
          font-size: 15px;
        ">
          Q${i + 1}: ${ans.question}
        </p>
        <p style="
          color: #6b7280;
          font-size: 13px;
          margin: 0 0 12px;
          line-height: 1.6;
        ">
          ${ans.transcript}
        </p>
        <div style="
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        ">
          ${Object.entries(ans.scores).map(([key, val]) => `
            <span style="
              background: #eef2ff;
              color: #6366f1;
              padding: 3px 10px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
            ">
              ${key}: ${val}/10
            </span>
          `).join("")}
        </div>
        <div style="
          background: #eff6ff;
          border-left: 3px solid #6366f1;
          border-radius: 0 8px 8px 0;
          padding: 10px 14px;
          font-size: 13px;
          color: #1d4ed8;
        ">
          💡 ${ans.feedback}
        </div>
      </div>
    `).join("");

    // Build full email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>PrepAI Interview Report</title>
      </head>
      <body style="
        font-family: 'Segoe UI', system-ui, sans-serif;
        background: #f1f5f9;
        margin: 0;
        padding: 40px 20px;
      ">
        <div style="
          max-width: 620px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        ">

          <!-- Header -->
          <div style="
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            padding: 36px 40px;
            text-align: center;
          ">
            <div style="
              width: 52px;
              height: 52px;
              background: rgba(255,255,255,0.2);
              border-radius: 14px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              margin-bottom: 16px;
            ">🎯</div>
            <h1 style="
              color: #ffffff;
              font-size: 24px;
              font-weight: 800;
              margin: 0 0 6px;
            ">
              Interview Report
            </h1>
            <p style="
              color: rgba(255,255,255,0.8);
              margin: 0;
              font-size: 14px;
            ">
              ${session.jobRole} • ${new Date(session.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 36px 40px;">

            <!-- Overall Score -->
            <div style="
              text-align: center;
              background: #f8fafc;
              border-radius: 16px;
              padding: 28px;
              margin-bottom: 28px;
              border: 1px solid #e5e7eb;
            ">
              <p style="
                color: #6b7280;
                font-size: 13px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin: 0 0 8px;
              ">
                Overall Score
              </p>
              <div style="
                font-size: 56px;
                font-weight: 900;
                color: ${getScoreColor(overallAverage)};
                line-height: 1;
                margin-bottom: 4px;
              ">
                ${overallAverage}
              </div>
              <div style="
                color: #9ca3af;
                font-size: 18px;
                font-weight: 600;
              ">
                out of 10 ${getScoreEmoji(overallAverage)}
              </div>
            </div>

            <!-- Dimension Scores -->
            <h2 style="
              color: #1f2937;
              font-size: 16px;
              font-weight: 700;
              margin: 0 0 16px;
            ">
              Score Breakdown
            </h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              ${Object.entries(avgScores).map(([key, val]) => `
                <tr>
                  <td style="
                    padding: 10px 0;
                    color: #374151;
                    font-weight: 600;
                    font-size: 14px;
                    text-transform: capitalize;
                    border-bottom: 1px solid #f3f4f6;
                  ">
                    ${key}
                  </td>
                  <td style="
                    padding: 10px 0;
                    text-align: right;
                    border-bottom: 1px solid #f3f4f6;
                  ">
                    <span style="
                      background: #eef2ff;
                      color: #6366f1;
                      padding: 3px 12px;
                      border-radius: 20px;
                      font-weight: 700;
                      font-size: 13px;
                    ">
                      ${val}/10
                    </span>
                  </td>
                </tr>
              `).join("")}
            </table>

            <!-- Answers -->
            <h2 style="
              color: #1f2937;
              font-size: 16px;
              font-weight: 700;
              margin: 0 0 16px;
            ">
              Question Breakdown
            </h2>

            ${answersHTML}

            <!-- CTA -->
            <div style="
              text-align: center;
              margin-top: 32px;
              padding-top: 28px;
              border-top: 1px solid #f3f4f6;
            ">
              <p style="
                color: #6b7280;
                font-size: 14px;
                margin: 0 0 16px;
              ">
                Keep practicing to improve your scores!
              </p>
              
                href="${process.env.CLIENT_URL}/home"
                style="
                  display: inline-block;
                  background: linear-gradient(135deg, #6366f1, #8b5cf6);
                  color: #ffffff;
                  padding: 13px 32px;
                  border-radius: 10px;
                  text-decoration: none;
                  font-weight: 700;
                  font-size: 15px;
                "
              >
                🚀 Practice Another Interview
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="
            background: #f8fafc;
            padding: 20px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          ">
            <p style="
              color: #9ca3af;
              font-size: 12px;
              margin: 0;
            ">
              © 2025 PrepAI — AI-Powered Interview Preparation
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"PrepAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `📊 Your PrepAI Interview Report — ${session.jobRole}`,
      html: emailHTML,
    });

    res.status(200).json({
      message: "Report sent successfully to your email!",
    });
  } catch (error) {
    console.error("Send email error:", error.message);
    res.status(500).json({ message: "Failed to send email report" });
  }
};

module.exports = { sendEmailReport };