import json
import logging
import os
from typing import List
from app.models.schemas import SkillAssessmentResponse, SkillGapItem, PreviousInteraction
from app.services.gpt_service import gpt_service
from app.services.scoring_service import scoring_service

logger = logging.getLogger(__name__)

class SkillAssessmentAgent:
    """
    AGENT 4: SKILL ASSESSMENT AGENT
    Aggregates multi-turn interview interactions across 4 competency pillars and detects skill gaps.
    """
    def __init__(self):
        self.prompt_template = self._load_prompt()

    def _load_prompt(self) -> str:
        prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", "skill_prompt.txt")
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error loading skill prompt: {e}")
            return "Aggregate skills and return JSON."

    def assess_skills(
        self,
        job_role: str,
        interview_type: str,
        interactions: List[PreviousInteraction]
    ) -> SkillAssessmentResponse:
        
        # 1. Compute category aggregations
        cat_scores = {"Technical": [], "Problem Solving": [], "Communication": [], "Behavioral": []}
        all_scores = []

        for item in interactions:
            all_scores.append(item.score)
            c = (item.category or "").strip().title()
            if "Tech" in c:
                cat_scores["Technical"].append(item.score)
            elif "Problem" in c or "Solving" in c:
                cat_scores["Problem Solving"].append(item.score)
            elif "Comm" in c:
                cat_scores["Communication"].append(item.score)
            elif "Behav" in c:
                cat_scores["Behavioral"].append(item.score)
            else:
                cat_scores["Technical"].append(item.score)

        avg_overall = sum(all_scores) / len(all_scores) if all_scores else 75.0

        def calc_avg(scores, fallback):
            return sum(scores) / len(scores) if scores else fallback

        tech_avg = round(calc_avg(cat_scores["Technical"], avg_overall), 2)
        prob_avg = round(calc_avg(cat_scores["Problem Solving"], avg_overall), 2)
        comm_avg = round(calc_avg(cat_scores["Communication"], avg_overall), 2)
        beh_avg = round(calc_avg(cat_scores["Behavioral"], avg_overall), 2)

        overall_calc, _ = scoring_service.calculate_career_readiness(tech_avg, prob_avg, comm_avg, beh_avg)

        # 2. Invoke GPT via LangChain
        formatted_prompt = self.prompt_template.format(
            job_role=job_role,
            interview_type=interview_type,
            interactions=json.dumps([p.model_dump() for p in interactions])
        )

        response_text = gpt_service.invoke(formatted_prompt)
        if response_text:
            try:
                data = gpt_service.clean_json_response(response_text)
                gaps = [
                    SkillGapItem(
                        skill_name=g.get("skill_name", "Core Architecture"),
                        current_level=g.get("current_level", "INTERMEDIATE"),
                        target_level=g.get("target_level", "ADVANCED"),
                        recommendation=g.get("recommendation", "Deepen hands-on practice.")
                    )
                    for g in data.get("skill_gaps", [])
                ]
                return SkillAssessmentResponse(
                    technical_score=float(data.get("technical_score", tech_avg)),
                    problem_solving_score=float(data.get("problem_solving_score", prob_avg)),
                    communication_score=float(data.get("communication_score", comm_avg)),
                    behavioral_score=float(data.get("behavioral_score", beh_avg)),
                    overall_score=float(data.get("overall_score", overall_calc)),
                    strengths=data.get("strengths", ["Solid foundational knowledge"]),
                    weaknesses=data.get("weaknesses", ["Edge case optimization"]),
                    skill_gaps=gaps
                )
            except Exception as e:
                logger.warning(f"Failed to parse skill assessment response: {e}")

        # 3. Fallback Synthesizer
        skill_gaps = []
        if tech_avg < 80.0:
            skill_gaps.append(SkillGapItem(
                skill_name=f"{job_role} Core Architecture",
                current_level="INTERMEDIATE" if tech_avg >= 60 else "BEGINNER",
                target_level="ADVANCED",
                recommendation="Build end-to-end full stack projects with asynchronous queue handling and unit testing."
            ))
        if prob_avg < 80.0:
            skill_gaps.append(SkillGapItem(
                skill_name="Algorithmic Complexity & System Design",
                current_level="INTERMEDIATE" if prob_avg >= 60 else "BEGINNER",
                target_level="ADVANCED",
                recommendation="Solve medium/hard data structure problems and study distributed system trade-offs."
            ))
        if comm_avg < 80.0:
            skill_gaps.append(SkillGapItem(
                skill_name="Technical Communication & Storytelling",
                current_level="INTERMEDIATE",
                target_level="ADVANCED",
                recommendation="Structure technical explanations using analogies and high-level architectural summaries."
            ))

        strengths = [
            f"Strong aptitude in {job_role} domain fundamentals",
            "Structured analytical approach to answering interview challenges",
            "Clear communication and positive professional demeanor"
        ]

        weaknesses = [
            "Could provide more comprehensive edge case and performance considerations",
            "Opportunities to improve depth in system scalability and failure recovery"
        ]

        return SkillAssessmentResponse(
            technical_score=tech_avg,
            problem_solving_score=prob_avg,
            communication_score=comm_avg,
            behavioral_score=beh_avg,
            overall_score=overall_calc,
            strengths=strengths,
            weaknesses=weaknesses,
            skill_gaps=skill_gaps
        )

skill_agent = SkillAssessmentAgent()
