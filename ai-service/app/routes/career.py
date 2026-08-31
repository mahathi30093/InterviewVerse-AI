import logging
from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    CareerReadinessRequest,
    CareerReadinessResponse
)
from app.agents.career_agent import career_agent

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["Career Readiness"])

@router.post("/career-readiness", response_model=CareerReadinessResponse)
async def assess_career_readiness(request: CareerReadinessRequest):
    """
    AGENT 5: Transform interview assessment scores into readiness level and actionable career roadmap.
    Formula: overall = technical * 0.35 + problem_solving * 0.25 + communication * 0.20 + behavioral * 0.20
    """
    try:
        result = career_agent.evaluate_readiness(
            job_role=request.job_role,
            technical_score=request.technical_score,
            problem_solving_score=request.problem_solving_score,
            communication_score=request.communication_score,
            behavioral_score=request.behavioral_score,
            strengths=request.strengths,
            weaknesses=request.weaknesses,
            skill_gaps=request.skill_gaps
        )
        return result
    except Exception as e:
        logger.error(f"Error in /career-readiness: {e}")
        raise HTTPException(status_code=500, detail=f"Career readiness calculation failed: {str(e)}")
