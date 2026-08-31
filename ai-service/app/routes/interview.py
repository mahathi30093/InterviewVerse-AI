import logging
from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    QuestionRequest,
    QuestionItem,
    AdaptiveQuestionRequest,
    AdaptiveQuestionResponse,
    InterviewNextRequest,
    InterviewNextResponse,
    PreviousInteraction
)
from app.agents.orchestrator_agent import orchestrator_agent
from app.agents.adaptive_agent import adaptive_agent
from app.agents.evaluation_agent import evaluation_agent
from app.agents.skill_agent import skill_agent
from app.agents.career_agent import career_agent

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["Interview Lifecycle & Agents"])

@router.post("/generate-question", response_model=QuestionItem)
async def generate_single_question(request: QuestionRequest):
    """
    Generate an interview question for a specified role, category, and difficulty.
    """
    try:
        response = adaptive_agent.generate_next_question(
            candidate_profile=request.candidate_profile,
            target_role=request.target_role,
            interview_type=request.interview_type,
            current_difficulty=request.difficulty,
            sequence_number=request.sequence_number,
            previous_interactions=[]
        )
        return QuestionItem(
            id=f"q_{request.sequence_number}",
            question=response.question,
            category=response.category,
            topic=response.topic,
            difficulty=response.difficulty,
            sequence_number=response.sequence_number
        )
    except Exception as e:
        logger.error(f"Error in /generate-question: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/adaptive-question", response_model=AdaptiveQuestionResponse)
async def generate_adaptive_question(request: AdaptiveQuestionRequest):
    """
    AGENT 2: Dynamically calculate next question difficulty and topic based on candidate trajectory.
    """
    try:
        return adaptive_agent.generate_next_question(
            candidate_profile=request.candidate_profile,
            target_role=request.target_role,
            interview_type=request.interview_type,
            current_difficulty=request.current_difficulty,
            sequence_number=request.current_question_number,
            previous_interactions=request.previous_interactions
        )
    except Exception as e:
        logger.error(f"Error in /adaptive-question: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/interview/next", response_model=InterviewNextResponse)
async def process_interview_next_step(request: InterviewNextRequest):
    """
    MULTI-AGENT ORCHESTRATION PIPELINE:
    1. If answer provided -> Invoke Evaluation Agent (Agent 3)
    2. Invoke Orchestrator Agent (Agent 1) to determine next state & agent delegation
    3. If Continuing -> Invoke Adaptive Interview Agent (Agent 2)
    4. If Completed -> Invoke Skill Assessment Agent (Agent 4) + Career Readiness Agent (Agent 5)
    """
    try:
        interactions = list(request.interactions)
        evaluation_result = None
        last_score = 75.0
        current_diff = request.last_difficulty or "EASY"

        # Step 1: If an answer was submitted for the last question, evaluate it
        if request.last_answer and request.last_question:
            evaluation_result = evaluation_agent.evaluate_answer(
                question=request.last_question,
                candidate_answer=request.last_answer,
                job_role=request.target_role,
                skill=request.last_topic or "General",
                category=request.last_category or "Technical",
                difficulty=request.last_difficulty or "EASY"
            )
            last_score = evaluation_result.score
            
            # Record this completed interaction
            interactions.append(PreviousInteraction(
                sequence_number=len(interactions) + 1,
                question=request.last_question,
                category=request.last_category or "Technical",
                topic=request.last_topic or "General",
                difficulty=request.last_difficulty or "EASY",
                answer=request.last_answer,
                score=evaluation_result.score,
                feedback=evaluation_result.feedback
            ))

        # Step 2: Invoke Orchestrator Agent
        orchestrator_decision = orchestrator_agent.decide_next_step(
            candidate_profile=request.candidate_profile or {},
            target_role=request.target_role,
            interview_type=request.interview_type,
            current_question_number=len(interactions) + 1 if request.last_answer else request.current_question_number,
            max_questions=request.max_questions,
            previous_interactions=interactions,
            last_score=last_score,
            current_difficulty=current_diff
        )

        next_question_res = None
        skill_res = None
        career_res = None

        # Step 3: Handle next action based on Orchestrator decision
        if orchestrator_decision.continue_interview:
            # Generate next adaptive question
            next_question_res = adaptive_agent.generate_next_question(
                candidate_profile=request.candidate_profile,
                target_role=request.target_role,
                interview_type=request.interview_type,
                current_difficulty=orchestrator_decision.current_difficulty,
                sequence_number=orchestrator_decision.next_sequence_number,
                previous_interactions=interactions
            )
        else:
            # Trigger Skill Assessment Agent (Agent 4)
            skill_res = skill_agent.assess_skills(
                job_role=request.target_role,
                interview_type=request.interview_type,
                interactions=interactions
            )

            # Trigger Career Readiness Agent (Agent 5)
            career_res = career_agent.evaluate_readiness(
                job_role=request.target_role,
                technical_score=skill_res.technical_score,
                problem_solving_score=skill_res.problem_solving_score,
                communication_score=skill_res.communication_score,
                behavioral_score=skill_res.behavioral_score,
                strengths=skill_res.strengths,
                weaknesses=skill_res.weaknesses,
                skill_gaps=skill_res.skill_gaps
            )

        return InterviewNextResponse(
            evaluation=evaluation_result,
            orchestrator=orchestrator_decision,
            next_question=next_question_res,
            skill_assessment=skill_res,
            career_readiness=career_res
        )

    except Exception as e:
        logger.error(f"Error in /interview/next orchestration: {e}")
        raise HTTPException(status_code=500, detail=str(e))
