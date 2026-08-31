import json
import logging
import os
import glob
import random
from typing import Dict, Any, List, Optional
from app.config import settings
from app.models.schemas import AdaptiveQuestionResponse, PreviousInteraction
from app.services.gpt_service import gpt_service
from app.services.scoring_service import scoring_service

logger = logging.getLogger(__name__)

class AdaptiveInterviewAgent:
    """
    AGENT 2: ADAPTIVE INTERVIEW AGENT
    Dynamically adjusts question difficulty and sequences topics based on candidate performance.
    """
    def __init__(self):
        self.prompt_template = self._load_prompt()
        self.question_bank = self._load_question_bank()

    def _load_prompt(self) -> str:
        prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", "adaptive_prompt.txt")
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error loading adaptive prompt: {e}")
            return "Generate adaptive question in JSON."

    def _load_question_bank(self) -> List[Dict[str, Any]]:
        bank = []
        
        # Possible locations depending on host/container execution
        possible_dirs = [
            "/app/data/questions",
            os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "questions"),
            os.path.abspath(settings.DATA_PATH)
        ]
        
        base_dir = None
        for d in possible_dirs:
            if os.path.exists(d):
                base_dir = d
                break
                
        if not base_dir:
            logger.error("Could not find data/questions directory in any known path.")
            return []
        
        json_files = glob.glob(os.path.join(base_dir, "*.json"))
        for file_path in json_files:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    items = json.load(f)
                    if isinstance(items, list):
                        bank.extend(items)
            except Exception as e:
                logger.warning(f"Failed to read question bank file {file_path}: {e}")
        return bank

    def generate_next_question(
        self,
        candidate_profile: Optional[Dict[str, Any]],
        target_role: str,
        interview_type: str,
        current_difficulty: str,
        sequence_number: int,
        previous_interactions: List[PreviousInteraction]
    ) -> AdaptiveQuestionResponse:
        
        # 1. Determine next difficulty
        last_score = 75.0
        if previous_interactions:
            last_interaction = previous_interactions[-1]
            last_score = last_interaction.score
            next_difficulty, reasoning = scoring_service.compute_next_difficulty(last_score, current_difficulty)
        else:
            next_difficulty = (current_difficulty or "EASY").upper()
            reasoning = "Initial question for interview session."

        # 2. Determine target category based on interview type and sequence
        category_order = ["Technical", "Problem Solving", "Communication", "Behavioral"]
        if interview_type.lower() == "mixed":
            category_idx = (sequence_number - 1) % len(category_order)
            target_category = category_order[category_idx]
        elif interview_type.lower() in ["technical", "problem solving", "communication", "behavioral"]:
            target_category = interview_type.title()
        else:
            target_category = "Technical"

        # 3. Try LangChain GPT prompt execution
        asked_questions = [p.question for p in previous_interactions]
        formatted_prompt = self.prompt_template.format(
            candidate_profile=json.dumps(candidate_profile or {}),
            target_role=target_role,
            interview_type=interview_type,
            current_difficulty=next_difficulty,
            sequence_number=sequence_number,
            previous_interactions=json.dumps([p.model_dump() for p in previous_interactions])
        )

        response_text = gpt_service.invoke(formatted_prompt)
        if response_text:
            try:
                data = gpt_service.clean_json_response(response_text)
                return AdaptiveQuestionResponse(
                    question=data.get("question", "Explain your approach to system architecture."),
                    category=data.get("category", target_category),
                    topic=data.get("topic", "General"),
                    difficulty=data.get("difficulty", next_difficulty),
                    sequence_number=sequence_number,
                    reasoning=data.get("reasoning", reasoning),
                    action=data.get("action", "CONTINUE")
                )
            except Exception as e:
                logger.warning(f"Failed to parse GPT response for adaptive question: {e}")

        # 4. Fallback to rich question bank matching category, difficulty & role
        matching_questions = [
            q for q in self.question_bank
            if q.get("category", "").lower() == target_category.lower()
            and q.get("difficulty", "").upper() == next_difficulty.upper()
            and q.get("question") not in asked_questions
        ]

        if not matching_questions:
            # Relax difficulty filter if exhausted
            matching_questions = [
                q for q in self.question_bank
                if q.get("category", "").lower() == target_category.lower()
                and q.get("question") not in asked_questions
            ]

        if not matching_questions:
            matching_questions = [
                q for q in self.question_bank
                if q.get("question") not in asked_questions
            ]

        if matching_questions:
            import random
            random.shuffle(matching_questions)
            chosen = random.choice(matching_questions)
            return AdaptiveQuestionResponse(
                question=chosen.get("question"),
                category=chosen.get("category", target_category),
                topic=chosen.get("topic", "Software Engineering"),
                difficulty=next_difficulty,
                sequence_number=sequence_number,
                reasoning=reasoning,
                action="CONTINUE"
            )

        # Extreme fallback
        return AdaptiveQuestionResponse(
            question=f"Describe a challenging scenario you encountered while working with {target_role} technologies, and how you resolved it.",
            category=target_category,
            topic="Applied Problem Solving",
            difficulty=next_difficulty,
            sequence_number=sequence_number,
            reasoning=reasoning,
            action="CONTINUE"
        )

adaptive_agent = AdaptiveInterviewAgent()
