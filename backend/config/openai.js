const Groq = require("groq-sdk");

const openai = new Groq({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;