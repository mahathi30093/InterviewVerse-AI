from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class QuestionItem(BaseModel):
    id: Optional[str] = None
    question: str
    category: str = "Technical" # Technical, Problem Solving, Communication, Behavioral
    topic: str = "General"
    difficulty: str = "EASY" # EASY, MEDIUM, HARD
    sequence_number: int = 1
    expected_concepts: Optional[List[str]] = []

class QuestionRequest(BaseModel):
    candidate_profile: Optional[Dict[str, Any]] = None
    target_role: str = "Software Developer"
    interview_type: str = "Mixed"
    category: Optional[str] = "Technical"
    topic: Optional[str] = None
    difficulty: str = "EASY"
    sequence_number: int = 1
    previous_questions: Optional[List[str]] = []

class AnswerAnalysisRequest(BaseModel):
    question: str
    candidate_answer: str
    expected_concepts: Optional[List[str]] = []
    job_role: str = "Software Developer"
    skill: Optional[str] = "General"
    category: Optional[str] = "Technical"
    difficulty: Optional[str] = "MEDIUM"

class AnswerAnalysisResponse(BaseModel):
    score: float = Field(..., ge=0, le=100)
    correctness: float = Field(..., ge=0, le=100)
    relevance: float = Field(..., ge=0, le=100)
    completeness: float = Field(..., ge=0, le=100)
    skill: str
    strengths: List[str] = []
    weaknesses: List[str] = []
    feedback: str

class PreviousInteraction(BaseModel):
    sequence_number: int
    question: str
    category: str
    topic: str
    difficulty: str
    answer: str
    score: float
    feedback: Optional[str] = None

class AdaptiveQuestionRequest(BaseModel):
    candidate_profile: Optional[Dict[str, Any]] = None
    target_role: str = "Software Developer"
    interview_type: str = "Mixed"
    current_difficulty: str = "EASY"
    current_question_number: int = 1
    max_questions: int = 5
    previous_interactions: List[PreviousInteraction] = []

class AdaptiveQuestionResponse(BaseModel):
    question: str
    category: str
    topic: str
    difficulty: str # Next difficulty
    sequence_number: int
    reasoning: Optional[str] = None
    action: str = "CONTINUE" # CONTINUE, WRAP_UP

class OrchestratorDecision(BaseModel):
    next_action: str # "GENERATE_FIRST_QUESTION", "EVALUATE_ANSWER", "GENERATE_ADAPTIVE_QUESTION", "TRIGGER_FINAL_ASSESSMENT"
    agent_to_call: str # "AdaptiveAgent", "EvaluationAgent", "SkillAgent", "CareerAgent"
    interview_state: str # "STARTING", "IN_PROGRESS", "FINALIZING", "COMPLETED"
    continue_interview: bool
    current_difficulty: str
    next_sequence_number: int
    message: Optional[str] = None

class SkillAssessmentRequest(BaseModel):
    job_role: str = "Software Developer"
    interview_type: str = "Mixed"
    interactions: List[PreviousInteraction]

class SkillGapItem(BaseModel):
    skill_name: str
    current_level: str # BEGINNER, INTERMEDIATE, ADVANCED
    target_level: str # INTERMEDIATE, ADVANCED, EXPERT
    recommendation: str

class SkillAssessmentResponse(BaseModel):
    technical_score: float = Field(..., ge=0, le=100)
    problem_solving_score: float = Field(..., ge=0, le=100)
    communication_score: float = Field(..., ge=0, le=100)
    behavioral_score: float = Field(..., ge=0, le=100)
    overall_score: float = Field(..., ge=0, le=100)
    strengths: List[str] = []
    weaknesses: List[str] = []
    skill_gaps: List[SkillGapItem] = []

class CareerReadinessRequest(BaseModel):
    job_role: str = "Software Developer"
    technical_score: float
    problem_solving_score: float
    communication_score: float
    behavioral_score: float
    overall_score: Optional[float] = None
    strengths: Optional[List[str]] = []
    weaknesses: Optional[List[str]] = []
    skill_gaps: Optional[List[SkillGapItem]] = []

class CareerReadinessResponse(BaseModel):
    readiness_score: float = Field(..., ge=0, le=100)
    readiness_level: str # NOT READY, BEGINNER READY, INTERVIEW READY, JOB READY
    strengths: List[str] = []
    weaknesses: List[str] = []
    skill_gaps: List[SkillGapItem] = []
    recommendations: List[str] = []

class InterviewNextRequest(BaseModel):
    candidate_profile: Optional[Dict[str, Any]] = None
    target_role: str = "Software Developer"
    interview_type: str = "Mixed"
    last_answer: Optional[str] = None
    last_question: Optional[str] = None
    last_category: Optional[str] = None
    last_topic: Optional[str] = None
    last_difficulty: Optional[str] = "EASY"
    interactions: List[PreviousInteraction] = []
    current_question_number: int = 1
    max_questions: int = 5

class InterviewNextResponse(BaseModel):
    evaluation: Optional[AnswerAnalysisResponse] = None
    orchestrator: OrchestratorDecision
    next_question: Optional[AdaptiveQuestionResponse] = None
    skill_assessment: Optional[SkillAssessmentResponse] = None
    career_readiness: Optional[CareerReadinessResponse] = None

class TranscriptionResponse(BaseModel):
    text: str
    confidence: float = 0.95
    source: str = "whisper"
