# InterviewVerseAI – An Agentic Intelligent Interview Assessment Ecosystem for Adaptive Skill Evaluation and Personalized Career Readiness

## Team Members

| Name | Roll Number |
| ---- | ----------- |
| V. Dhanush | 2420030162 |
| B. Srihitha | 2420030099 |
| E. Mahathi | 2420030093 |

## Supervisor

Dr. Srikanth Cherukuvada

## Abstract

Traditional interview processes often depend on fixed questions, manual evaluation, and subjective judgment, making it difficult to accurately assess the diverse skills of candidates. Existing online interview and assessment platforms generally focus on predefined question sets, technical tests, or basic scoring, with limited ability to adapt the interview according to a candidate's performance.

InterviewVerseAI is an Agentic AI-based adaptive interview assessment ecosystem designed to transform the traditional interview into an intelligent and personalized journey. The system dynamically generates and adjusts interview questions based on candidate responses and evaluates multiple dimensions including technical skills, problem-solving, communication, and behavioural skills.

The system uses AI/LLM technologies, NLP, speech-to-text, and agentic AI orchestration to conduct adaptive interviews, analyze candidate responses, identify strengths, weaknesses, and skill gaps, and generate personalized feedback and career-readiness recommendations.

## Setup and Execution Instructions

1. Clone this repository.

2. Install the required dependencies.

3. Configure the required AI/LLM API credentials and environment variables.

4. Prepare the required datasets and model resources under `/data`.

5. Start the backend services.

6. Start the React frontend.

7. Open the application and select the required interview role or assessment.

8. Answer the dynamically generated interview questions.

9. View the generated skill assessment, personalized feedback, and career-readiness report.

## Proposed Technology Stack

- React — Candidate interview interface and performance dashboard
- FastAPI — AI services, interview logic, APIs, and communication between modules
- Spring Boot — Application services, candidate data, assessment workflows, and backend integration
- GPT-5 API — Adaptive question generation, response evaluation, and personalized feedback
- Whisper — Speech-to-text conversion for voice responses
- LangChain — Agent orchestration, context management, and adaptive interview flow
- PostgreSQL — Candidate profiles, questions, responses, scores, assessments, and feedback
- Docker — Containerization and consistent deployment

## Project Structure

* `/frontend` — React-based candidate interview interface, question display, response submission, and performance dashboard

* `/backend` — FastAPI and Spring Boot services for interview logic, APIs, AI integration, candidate data, and assessment workflows

* `/agents` — Agentic AI components including Interview Agent, Technical Assessment Agent, Communication Agent, Behavioral Assessment Agent, Feedback Agent, and Orchestration/Planning Agent

* `/models` — NLP, LLM, speech-processing, and machine-learning resources used for interview analysis

* `/data` — datasets and supporting data resources used for assessment and evaluation

* `/database` — PostgreSQL database resources for candidate profiles, interview sessions, responses, scores, assessments, and feedback

* `/docs` — architecture diagrams, literature survey, research gap, methodology, innovation, feasibility, and project documentation

* `/results` — interview assessment results, skill scores, feedback, and evaluation outputs

* `/reports` — Review 1, Review 2, and final project reports

* `/README.md` — project overview, setup instructions, execution instructions, and current phase status

## Key Features

* Agentic AI-powered interviewer
* Adaptive interview journey
* Dynamic question generation
* Adaptive question difficulty
* Technical skill assessment
* Problem-solving assessment
* Communication assessment
* Behavioral skill assessment
* NLP-based response analysis
* Multi-agent interview evaluation
* Skill-gap identification
* Personalized feedback
* Career-readiness assessment

## Innovation

### 1. Agentic Interviewer

Instead of following a fixed interviewer/question sequence, an AI agent dynamically decides what question should be asked next based on the candidate's responses.

### 2. Adaptive Difficulty

The difficulty of interview questions changes according to candidate performance, providing an appropriately challenging assessment.

### 3. Multi-Skill Evaluation

The system evaluates technical, problem-solving, communication, and behavioural skills together to create a comprehensive candidate profile.

### 4. Personalized Career Feedback

Instead of ending the assessment with only a score, the system converts assessment results into personalized improvement recommendations and career-readiness insights.

## Target Users

* Students and job seekers preparing for interviews
* Colleges and universities conducting placement preparation
* Training and skill-development institutes
* EdTech and interview-preparation platforms
* Organizations conducting preliminary candidate assessments

## Real-World Use

InterviewVerseAI can be used as an intelligent mock-interview and assessment platform for placement preparation and career development.

Colleges can use the system to identify student skill gaps before placement drives. Students can use it for personalized interview practice and preparation. Training institutes can use it to evaluate learners and recommend areas for improvement. Organizations can potentially use it for structured preliminary candidate assessment.

## Current Phase Status

Review 1 - Completed

Review 2 - In progress
