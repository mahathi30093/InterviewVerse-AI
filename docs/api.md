# InterviewVerseAI API Documentation

## 1. Spring Boot Backend APIs (Port 8080)

### Authentication
- `POST /api/auth/register`
  - Body: `{ name, email, password, role, targetRole, education, experience, skills }`
  - Returns: `{ token, userId, name, email, role }`
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Returns: `{ token, userId, name, email, role }`

### Candidate Profile
- `GET /api/candidates/profile`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Candidate Profile object.
- `PUT /api/candidates/profile`
  - Body: Candidate Profile update fields.
- `GET /api/candidates/history`
  - Returns: List of all past sessions for current user.

### Interview Session Lifecycle
- `POST /api/interviews/start`
  - Body: `{ jobRole, interviewType, initialDifficulty }`
  - Returns: Initialized `InterviewSessionDto` with Question 1.
- `GET /api/interviews/{id}`
  - Returns: Current session state and question history.
- `POST /api/interviews/{id}/answer`
  - Body: `{ questionId, answerText }`
  - Returns: `{ score, correctness, relevance, completeness, feedback, nextDifficulty, nextQuestion, isInterviewComplete }`
- `POST /api/interviews/{id}/voice-answer`
  - Multipart: `file` (WAV audio), `questionId`, `fallbackText` (optional)
  - Returns: Transcription and evaluation response.
- `POST /api/interviews/{id}/complete`
  - Returns: Full final `AssessmentResponseDto`.

### Assessment Reports
- `GET /api/assessments/{sessionId}`
  - Returns: Complete assessment dossier (Scores, Strengths, Weaknesses, Skill Gaps, Career Roadmap).
- `GET /api/assessments/{sessionId}/skills`
  - Returns: Skill assessment scores across 4 pillars.
- `GET /api/assessments/{sessionId}/career-readiness`
  - Returns: Career readiness score, level, and recommendations.

### Admin Operations
- `GET /api/admin/dashboard`
  - Returns: Executive metrics (Total candidates, completed interviews, average score, readiness buckets).
- `GET /api/admin/candidates`
  - Returns: Table of all candidate scores and readiness.
- `GET /api/admin/reports`
  - Returns: Consolidated institutional report data.

---

## 2. FastAPI AI Service Endpoints (Port 8000)

- `GET /ai/health`
  - Health check endpoint.
- `POST /ai/generate-question`
  - Generates role-specific question.
- `POST /ai/analyze-answer`
  - Invokes Answer Evaluation Agent (Agent 3).
- `POST /ai/adaptive-question`
  - Invokes Adaptive Interview Agent (Agent 2).
- `POST /ai/transcribe`
  - Invokes Whisper Speech-to-Text service.
- `POST /ai/skill-assessment`
  - Invokes Skill Assessment Agent (Agent 4).
- `POST /ai/career-readiness`
  - Invokes Career Readiness Agent (Agent 5).
- `POST /ai/interview/next`
  - Invokes Master Multi-Agent Orchestration loop.
