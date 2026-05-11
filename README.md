PREPAI – AI Powered Interview Preparation Platform

PREPAI is an AI-driven interview preparation platform designed to simulate real interview experiences using resume-based question generation, voice interaction, AI evaluation, and detailed performance analysis.

The platform helps students and job seekers improve technical, communication, and problem-solving skills through intelligent mock interviews.

Features
Resume Upload & Parsing
AI Generated Personalized Interview Questions
Voice-Based Interview Interaction
Real-Time Speech-to-Text Transcription
AI Answer Evaluation & Scoring
Pressure Interview Mode
Aura Score & Personality Analysis
Interview Success Prediction
Weakness-Based Project Suggestions
Performance Analytics Dashboard
Technologies Used
Frontend
React.js
Tailwind CSS
Axios
React Router DOM
Backend
Node.js
Express.js
MongoDB
JWT Authentication
Multer File Upload
AI & APIs
OpenAI / LLM Integration
Whisper Speech-to-Text
PDF Resume Parsing

How the System Works
1. User Authentication
Users can register and login securely using JWT authentication.

2. Resume Upload
The user uploads a PDF resume.

Backend flow:
Multer uploads PDF temporarily
PDFReader extracts resume text
Extracted text is stored temporarily
File is deleted after processing
3. AI Question Generation

The extracted resume text and selected job role are sent to the AI model.

The AI generates:
Technical questions
Behavioral questions
Situational questions
Pressure-mode challenging questions
4. Voice-Based Answering

Users answer questions using microphone input.

The system:
records audio
converts speech to text using Whisper API
stores transcript

5. AI Evaluation
The AI evaluates answers across:
Technical Accuracy
Communication Clarity
Relevance
Structure & Depth

The system generates:
overall score
feedback
improvement suggestions

6. Advanced Analysis
PREPAI also generates:
Aura Score
Personality Mirror
Placement Risk Prediction
Strength & Weakness Analysis
Personalized Project Ideas
Error Handling Implemented
Resume Upload Error Handling

The system handles:

missing files
invalid PDF uploads
corrupted PDFs
upload directory issues
file cleanup after processing
AI Response Validation

The backend validates:

JSON response format
missing AI outputs
invalid scoring responses
Audio Processing Safety

The system:

validates audio uploads
removes temporary audio files
handles transcription failures safely
Security Features
JWT Protected Routes
Input Sanitization
File Type Validation
File Size Limits
Secure Environment Variables
Deployment
Frontend

Render
