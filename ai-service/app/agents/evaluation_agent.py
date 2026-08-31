import json
import logging
import os
from typing import List, Optional
from app.models.schemas import AnswerAnalysisResponse
from app.services.gpt_service import gpt_service

logger = logging.getLogger(__name__)

class AnswerEvaluationAgent:
    """
    AGENT 3: ANSWER EVALUATION AGENT
    Performs multi-dimensional evaluation on correctness, relevance, and completeness.
    """
    def __init__(self):
        self.prompt_template = self._load_prompt()

    def _load_prompt(self) -> str:
        prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", "evaluation_prompt.txt")
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error loading evaluation prompt: {e}")
            return "Evaluate answer and return JSON."

    def evaluate_answer(
        self,
        question: str,
        candidate_answer: str,
        expected_concepts: Optional[List[str]] = None,
        job_role: str = "Software Developer",
        skill: str = "General",
        category: str = "Technical",
        difficulty: str = "MEDIUM"
    ) -> AnswerAnalysisResponse:
        
        # 1. Clean input
        answer_text = (candidate_answer or "").strip()
        if not answer_text or len(answer_text) < 5:
            return AnswerAnalysisResponse(
                score=25.0,
                correctness=20.0,
                relevance=30.0,
                completeness=25.0,
                skill=skill or "General",
                strengths=["Attempted to submit an answer"],
                weaknesses=["Answer was too brief or incomplete to evaluate technical depth."],
                feedback="Please provide a more detailed explanation covering core concepts."
            )

        # 2. Invoke GPT via LangChain
        formatted_prompt = self.prompt_template.format(
            job_role=job_role,
            category=category,
            skill=skill or "General",
            difficulty=difficulty,
            question=question,
            expected_concepts=", ".join(expected_concepts) if expected_concepts else "Core fundamentals and trade-offs",
            candidate_answer=answer_text
        )

        response_text = gpt_service.invoke(formatted_prompt)
        if response_text:
            try:
                data = gpt_service.clean_json_response(response_text)
                return AnswerAnalysisResponse(
                    score=float(data.get("score", 75.0)),
                    correctness=float(data.get("correctness", 75.0)),
                    relevance=float(data.get("relevance", 75.0)),
                    completeness=float(data.get("completeness", 75.0)),
                    skill=data.get("skill", skill or "General"),
                    strengths=data.get("strengths", ["Clear explanation"]),
                    weaknesses=data.get("weaknesses", ["Could elaborate on edge cases"]),
                    feedback=data.get("feedback", "Good conceptual response.")
                )
            except Exception as e:
                logger.warning(f"Failed to parse evaluation response from GPT: {e}")

        # 3. Intelligent Heuristic Fallback
        # Measure word count, expected concept matches, keywords
        words = answer_text.split()
        word_count = len(words)
        
        base_score = 40.0
        
        # Give points for thoroughness but not purely length
        if word_count > 100:
            base_score += 20.0
        elif word_count > 50:
            base_score += 15.0
        elif word_count > 20:
            base_score += 10.0
        else:
            base_score -= 10.0 # too short

        # Check concept matches
        matched_concepts = []
        if expected_concepts:
            for concept in expected_concepts:
                if any(w.lower() in answer_text.lower() for w in concept.split()):
                    matched_concepts.append(concept)
            
            concept_ratio = len(matched_concepts) / max(len(expected_concepts), 1)
            base_score += (concept_ratio * 30.0)
        else:
            # General tech keywords if no expected concepts
            tech_keywords = ['system', 'data', 'architecture', 'api', 'database', 'memory', 'performance', 'design', 'test', 'scale', 'hash', 'object', 'class', 'thread', 'async', 'cloud', 'security']
            matched_tech = sum(1 for k in tech_keywords if k in answer_text.lower())
            base_score += min(matched_tech * 5.0, 30.0)

        final_score = min(max(round(base_score, 1), 20.0), 95.0)
        correctness = min(final_score + 2.0, 98.0)
        relevance = min(final_score + 3.0, 95.0)
        completeness = max(final_score - 4.0, 20.0)

        strengths = []
        weaknesses = []

        if final_score > 80:
            strengths.append(f"Demonstrated clear understanding of {skill or 'the topic'}")
            strengths.append("Addressed the primary requirements of the question effectively")
            weaknesses.append("Could provide more concrete production examples or trade-off benchmarks")
            feedback = f"Excellent technical explanation with solid structure ({final_score:.0f}/100)."
        elif final_score > 60:
            strengths.append("Showed basic understanding of the core concepts")
            weaknesses.append("Consider detailing failure modes and edge cases")
            feedback = f"Good foundational response ({final_score:.0f}/100). Explaining edge cases will elevate your response."
        else:
            strengths.append("Attempted to answer the prompt")
            weaknesses.append("Missing core technical details and depth")
            weaknesses.append("Answer was too brief or generic")
            feedback = f"The response lacked technical depth ({final_score:.0f}/100). Try to expand on the mechanisms and use-cases."

        if matched_concepts:
            strengths.append(f"Successfully highlighted key aspects of {matched_concepts[0]}")

        return AnswerAnalysisResponse(
            score=final_score,
            correctness=correctness,
            relevance=relevance,
            completeness=completeness,
            skill=skill or "Technical Assessment",
            strengths=strengths,
            weaknesses=weaknesses,
            feedback=feedback
        )

evaluation_agent = AnswerEvaluationAgent()
