import json
import logging
import os
from typing import List, Optional
from app.models.schemas import CareerReadinessResponse, SkillGapItem
from app.services.gpt_service import gpt_service
from app.services.scoring_service import scoring_service

logger = logging.getLogger(__name__)

class CareerReadinessAgent:
    """
    AGENT 5: CAREER READINESS AGENT
    Synthesizes overall interview trajectory into actionable career readiness benchmarks & roadmaps.
    """
    def __init__(self):
        self.prompt_template = self._load_prompt()

    def _load_prompt(self) -> str:
        prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", "career_prompt.txt")
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error loading career prompt: {e}")
            return "Generate career readiness report in JSON."

    def evaluate_readiness(
        self,
        job_role: str,
        technical_score: float,
        problem_solving_score: float,
        communication_score: float,
        behavioral_score: float,
        strengths: Optional[List[str]] = None,
        weaknesses: Optional[List[str]] = None,
        skill_gaps: Optional[List[SkillGapItem]] = None
    ) -> CareerReadinessResponse:
        
        # 1. Strictly apply the career readiness mathematical formula
        readiness_score, readiness_level = scoring_service.calculate_career_readiness(
            technical_score, problem_solving_score, communication_score, behavioral_score
        )

        # 2. Invoke GPT via LangChain
        formatted_prompt = self.prompt_template.format(
            job_role=job_role,
            technical_score=technical_score,
            problem_solving_score=problem_solving_score,
            communication_score=communication_score,
            behavioral_score=behavioral_score,
            overall_score=readiness_score,
            strengths=json.dumps(strengths or []),
            weaknesses=json.dumps(weaknesses or []),
            skill_gaps=json.dumps([g.model_dump() for g in skill_gaps] if skill_gaps else [])
        )

        response_text = gpt_service.invoke(formatted_prompt)
        if response_text:
            try:
                data = gpt_service.clean_json_response(response_text)
                gaps = [
                    SkillGapItem(
                        skill_name=g.get("skill_name", "Technical Skill"),
                        current_level=g.get("current_level", "INTERMEDIATE"),
                        target_level=g.get("target_level", "ADVANCED"),
                        recommendation=g.get("recommendation", "Continue focused practice.")
                    )
                    for g in data.get("skill_gaps", skill_gaps or [])
                ]
                return CareerReadinessResponse(
                    readiness_score=readiness_score,
                    readiness_level=readiness_level,
                    strengths=data.get("strengths", strengths or ["Solid technical and behavioral foundation."]),
                    weaknesses=data.get("weaknesses", weaknesses or ["Edge case handling in complex architectures."]),
                    skill_gaps=gaps,
                    recommendations=data.get("recommendations", [
                        f"Build advanced end-to-end portfolio projects tailored to {job_role}.",
                        "Practice timed mock interview scenarios focusing on architectural trade-offs.",
                        "Contribute to open source projects to gain real-world collaboration experience."
                    ])
                )
            except Exception as e:
                logger.warning(f"Failed to parse career readiness response: {e}")

        # 3. Fallback recommendations based on readiness level
        recommendations = []
        if readiness_level == "JOB READY":
            recommendations = [
                f"You are strongly qualified for {job_role} roles. Apply to Mid/Senior positions.",
                "Polish your portfolio with live deployed demos, performance benchmarks, and CI/CD pipelines.",
                "Prepare for system design deep dives and salary negotiations."
            ]
        elif readiness_level == "INTERVIEW READY":
            recommendations = [
                f"You have solid fundamentals for {job_role}. Begin applying for Associate / Junior roles.",
                "Review distributed systems, database indexing, and asynchronous messaging patterns.",
                "Participate in weekly mock interview rounds to sharpen communication flow under pressure."
            ]
        elif readiness_level == "BEGINNER READY":
            recommendations = [
                f"Focus on strengthening core programming syntax and algorithms for {job_role}.",
                "Build 2 complete full-stack projects from scratch with database integration.",
                "Practice explaining code logic clearly step-by-step."
            ]
        else: # NOT READY
            recommendations = [
                "Revisit foundational computer science and data structure fundamentals.",
                "Follow a structured learning curriculum and complete coding exercises daily.",
                "Focus on building small, functional applications before retaking mock assessments."
            ]

        return CareerReadinessResponse(
            readiness_score=readiness_score,
            readiness_level=readiness_level,
            strengths=strengths or [
                f"Solid grasp of {job_role} foundational concepts",
                "Strong willingness to articulate problem-solving thoughts",
                "Constructive professional attitude"
            ],
            weaknesses=weaknesses or [
                "Depth in asynchronous edge cases and fault tolerance",
                "Confidence in real-time architectural estimation"
            ],
            skill_gaps=skill_gaps or [],
            recommendations=recommendations
        )

career_agent = CareerReadinessAgent()
