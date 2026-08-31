import logging
from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    AnswerAnalysisRequest,
    AnswerAnalysisResponse,
    SkillAssessmentRequest,
    SkillAssessmentResponse
)
from app.agents.evaluation_agent import evaluation_agent
from app.agents.skill_agent import skill_agent

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["Assessment & Evaluation"])

@router.post("/analyze-answer", response_model=AnswerAnalysisResponse)
async def analyze_candidate_answer(request: AnswerAnalysisRequest):
    """
    AGENT 3: Evaluate candidate's single answer on correctness, relevance, completeness, and depth.
    """
    try:
        result = evaluation_agent.evaluate_answer(
            question=request.question,
            candidate_answer=request.candidate_answer,
            expected_concepts=request.expected_concepts,
            job_role=request.job_role,
            skill=request.skill or "Technical",
            category=request.category or "Technical",
            difficulty=request.difficulty or "MEDIUM"
        )
        return result
    except Exception as e:
        logger.error(f"Error in /analyze-answer: {e}")
        raise HTTPException(status_code=500, detail=f"Answer evaluation failed: {str(e)}")

@router.post("/skill-assessment", response_model=SkillAssessmentResponse)
async def evaluate_overall_skills(request: SkillAssessmentRequest):
    """
    AGENT 4: Synthesize full candidate interview history into 4 competency pillars and detect skill gaps.
    """
    try:
        result = skill_agent.assess_skills(
            job_role=request.job_role,
            interview_type=request.interview_type,
            interactions=request.interactions
        )
        return result
    except Exception as e:
        logger.error(f"Error in /skill-assessment: {e}")
        raise HTTPException(status_code=500, detail=f"Skill assessment failed: {str(e)}")
