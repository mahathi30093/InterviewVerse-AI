import json
import logging
import os
from typing import Dict, Any, List
from app.config import settings
from app.models.schemas import OrchestratorDecision, PreviousInteraction
from app.services.gpt_service import gpt_service
from app.services.scoring_service import scoring_service

logger = logging.getLogger(__name__)

class InterviewOrchestratorAgent:
    """
    AGENT 1: INTERVIEW ORCHESTRATOR AGENT
    Acts as the manager/coordinator of the complete interview.
    Tracks state, directs specialized agents, and triggers the final report.
    """
    def __init__(self):
        self.prompt_template = self._load_prompt()

    def _load_prompt(self) -> str:
        prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", "orchestrator_prompt.txt")
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error loading orchestrator prompt: {e}")
            return "Coordinate interview flow and return JSON decision."

    def decide_next_step(
        self,
        candidate_profile: Dict[str, Any],
        target_role: str,
        interview_type: str,
        current_question_number: int,
        max_questions: int,
        previous_interactions: List[PreviousInteraction],
        last_score: float = 75.0,
        current_difficulty: str = "EASY"
    ) -> OrchestratorDecision:
        interactions_count = len(previous_interactions)
        
        # 1. Starting state (Sequence 1, no prior answers)
        if current_question_number == 1 and interactions_count == 0:
            return OrchestratorDecision(
                next_action="GENERATE_FIRST_QUESTION",
                agent_to_call="AdaptiveAgent",
                interview_state="STARTING",
                continue_interview=True,
                current_difficulty=current_difficulty or "EASY",
                next_sequence_number=1,
                message="Starting new interview session. Calling Adaptive Interview Agent for Question 1."
            )

        # 2. Final state (Completed all questions)
        if interactions_count >= max_questions or current_question_number > max_questions:
            return OrchestratorDecision(
                next_action="TRIGGER_FINAL_ASSESSMENT",
                agent_to_call="SkillAgent",
                interview_state="FINALIZING",
                continue_interview=False,
                current_difficulty=current_difficulty,
                next_sequence_number=current_question_number,
                message=f"Reached interview question limit ({max_questions}). Triggering Skill & Career Readiness Assessment Agents."
            )

        # 3. Dynamic transition step using LangChain GPT / scoring
        formatted_prompt = self.prompt_template.format(
            candidate_profile=json.dumps(candidate_profile or {}),
            target_role=target_role,
            interview_type=interview_type,
            current_question_number=current_question_number,
            max_questions=max_questions,
            interactions_count=interactions_count,
            last_score=last_score,
            current_difficulty=current_difficulty
        )

        response_text = gpt_service.invoke(formatted_prompt)
        if response_text:
            try:
                data = gpt_service.clean_json_response(response_text)
                return OrchestratorDecision(**data)
            except Exception as e:
                logger.warning(f"Failed to parse LLM response for orchestrator: {e}")

        # Fallback decision
        next_diff, reason = scoring_service.compute_next_difficulty(last_score, current_difficulty)
        return OrchestratorDecision(
            next_action="GENERATE_ADAPTIVE_QUESTION",
            agent_to_call="AdaptiveAgent",
            interview_state="IN_PROGRESS",
            continue_interview=True,
            current_difficulty=next_diff,
            next_sequence_number=interactions_count + 1,
            message=f"Proceeding to question {interactions_count + 1}. {reason}"
        )

orchestrator_agent = InterviewOrchestratorAgent()
