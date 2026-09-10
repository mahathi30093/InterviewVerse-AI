# InterviewVerseAI System Architecture

## 1. Executive Architecture Overview

**InterviewVerseAI** is an enterprise-grade agentic interview assessment ecosystem designed for multi-dimensional candidate evaluation and career preparedness.

```
                     +---------------------------------------+
                     |         React SPA Frontend            |
                     |      (Glassmorphism UI, Port 3000)    |
                     +-------------------+-------------------+
                                         |
                                HTTP / REST (JWT)
                                         v
                     +---------------------------------------+
                     |         Spring Boot Backend           |
                     |     (Application Layer, Port 8080)    |
                     +-------------------+-------------------+
                                         |
                        +----------------+----------------+
                        |                                 |
                        v                                 v
        +-------------------------------+  +-------------------------------+
        |      PostgreSQL Database      |  |       FastAPI AI Service      |
        |      (Port 5432 / JPA)        |  |  (5 LangChain Agents, 8000)  |
        +-------------------------------+  +--------------+----------------+
                                                          |
                                           +--------------+--------------+
                                           |                             |
                                           v                             v
                              +-----------------------+     +-----------------------+
                              |   GPT-5 / OpenAI LLM  |     |  Whisper Speech STT   |
                              +-----------------------+     +-----------------------+
```

---

## 2. The 5 LangChain AI Agents

### Agent 1: Interview Orchestrator Agent (`orchestrator_agent.py`)
- **Role**: Master State Machine & Session Coordinator.
- **Responsibilities**:
  - Validates session initialization and candidate target roles.
  - Maintains conversation memory and question sequence progression.
  - Delegates execution to the Adaptive Agent or Evaluation Agent.
  - Triggers final competency and career assessment when sequence limits (5 questions) are reached.

### Agent 2: Adaptive Interview Agent (`adaptive_agent.py`)
- **Role**: Dynamic Difficulty & Follow-Up Generator.
- **Responsibilities**:
  - Dynamically calculates the next difficulty step:
    - $\text{Score} \ge 80 \implies \text{Increase Difficulty (EASY} \to \text{MEDIUM} \to \text{HARD)}$
    - $\text{Score } 60-79 \implies \text{Maintain Difficulty}$
    - $\text{Score} < 60 \implies \text{Decrease Difficulty (HARD} \to \text{MEDIUM} \to \text{EASY)}$
  - Alternates category tracks (Technical $\to$ Problem Solving $\to$ Communication $\to$ Behavioral) for Mixed assessments.
  - Formulates deep technical questions matching candidate profiles.

### Agent 3: Answer Evaluation Agent (`evaluation_agent.py`)
- **Role**: Multi-Dimensional Objective Grader.
- **Responsibilities**:
  - Evaluates candidate answers across 4 vectors: **Correctness (0-100)**, **Relevance (0-100)**, **Completeness (0-100)**, and **Technical Depth**.
  - Returns structured JSON with scores, strengths, weaknesses, and instant feedback.

### Agent 4: Skill Assessment Agent (`skill_agent.py`)
- **Role**: Multi-Turn Competency Synthesizer.
- **Responsibilities**:
  - Aggregates multi-question trajectories across 4 competency pillars:
    1. Technical Skill (0-100)
    2. Problem Solving (0-100)
    3. Communication (0-100)
    4. Behavioral Poise (0-100)
  - Identifies concrete skill gaps and specifies current vs. target levels.

### Agent 5: Career Readiness Agent (`career_agent.py`)
- **Role**: Benchmark Engine & Development Roadmap Architect.
- **Responsibilities**:
  - Computes composite career readiness score:
    $$\text{Readiness Score} = (\text{Technical} \times 0.35) + (\text{Problem Solving} \times 0.25) + (\text{Communication} \times 0.20) + (\text{Behavioral} \times 0.20)$$
  - Maps score into standardized readiness tiers:
    - **0 – 39%**: NOT READY
    - **40 – 59%**: BEGINNER READY
    - **60 – 79%**: INTERVIEW READY
    - **80 – 100%**: JOB READY
  - Produces personalized, actionable career recommendations.

---

## 3. Data Flow & Communication Lifecycle

```
[Candidate in React UI]
        │
        ▼ (Clicks "Start Interview")
[POST /api/interviews/start] ──► [Spring Boot] ──► [POST /ai/generate-question]
                                                        │
                                                        ▼ (Adaptive Agent)
                                                [Initial Question (EASY)]
                                                        │
        ◄───────────────────────────────────────────────┘
        │
        ▼ (Candidate Speaks or Types Answer)
[POST /api/interviews/{id}/voice-answer]
        │
        ▼ (Spring Boot delegates audio to Whisper)
[POST /ai/transcribe] ──► [Transcribed Text]
                                │
                                ▼ (Evaluation Agent)
                        [Score & Feedback]
                                │
                                ▼ (Adaptive Agent)
                        [Calibrated Next Difficulty & Question]
                                │
        ◄───────────────────────┘
        │
        ▼ (Repeat for 5 Questions)
[Session Complete] ──► [POST /ai/skill-assessment] & [POST /ai/career-readiness]
        │
        ▼ (Skill & Career Agents synthesize full report)
[Persist in PostgreSQL] ──► [Render Dynamic Report in React Result Dashboard]
```
