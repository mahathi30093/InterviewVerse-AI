import pytest
from app.services.scoring_service import scoring_service
from app.agents.adaptive_agent import adaptive_agent
from app.agents.evaluation_agent import evaluation_agent
from app.agents.skill_agent import skill_agent
from app.agents.career_agent import career_agent
from app.models.schemas import PreviousInteraction

def test_career_readiness_formula():
    # Formula: tech * 0.35 + prob * 0.25 + comm * 0.20 + beh * 0.20
    # 80 * 0.35 = 28
    # 70 * 0.25 = 17.5
    # 80 * 0.20 = 16
    # 90 * 0.20 = 18
    # Sum = 28 + 17.5 + 16 + 18 = 79.5 -> INTERVIEW READY
    overall, level = scoring_service.calculate_career_readiness(80.0, 70.0, 80.0, 90.0)
    assert overall == 79.5
    assert level == "INTERVIEW READY"

    # Test Job Ready bucket
    overall_high, level_high = scoring_service.calculate_career_readiness(90.0, 85.0, 85.0, 80.0)
    assert overall_high >= 80.0
    assert level_high == "JOB READY"

    # Test Beginner Ready bucket
    overall_low, level_low = scoring_service.calculate_career_readiness(50.0, 50.0, 50.0, 50.0)
    assert overall_low == 50.0
    assert level_low == "BEGINNER READY"

def test_adaptive_difficulty_rules():
    # Test increase difficulty on score >= 80
    diff, _ = scoring_service.compute_next_difficulty(85.0, "EASY")
    assert diff == "MEDIUM"

    diff, _ = scoring_service.compute_next_difficulty(88.0, "MEDIUM")
    assert diff == "HARD"

    diff, _ = scoring_service.compute_next_difficulty(95.0, "HARD")
    assert diff == "HARD" # Never exceed HARD

    # Test maintain difficulty on 60-79
    diff, _ = scoring_service.compute_next_difficulty(70.0, "MEDIUM")
    assert diff == "MEDIUM"

    # Test decrease difficulty on < 60
    diff, _ = scoring_service.compute_next_difficulty(45.0, "HARD")
    assert diff == "MEDIUM"

    diff, _ = scoring_service.compute_next_difficulty(40.0, "MEDIUM")
    assert diff == "EASY"

    diff, _ = scoring_service.compute_next_difficulty(30.0, "EASY")
    assert diff == "EASY" # Never below EASY

def test_evaluation_agent():
    res = evaluation_agent.evaluate_answer(
        question="Explain polymorphism in Java with an example.",
        candidate_answer="Polymorphism allows objects of different classes to be treated as instances of a common superclass. Compile-time polymorphism is method overloading, while runtime polymorphism is method overriding where a subclass provides a specific implementation of a method defined in its superclass.",
        expected_concepts=["Method Overloading", "Method Overriding", "Dynamic Dispatch"],
        job_role="Java Developer",
        skill="Java OOP",
        category="Technical",
        difficulty="EASY"
    )
    assert res.score >= 50.0
    assert len(res.strengths) > 0
    assert res.feedback is not None

def test_skill_and_career_agents():
    interactions = [
        PreviousInteraction(
            sequence_number=1,
            question="What is Java OOP?",
            category="Technical",
            topic="Java",
            difficulty="EASY",
            answer="OOP uses classes, inheritance, polymorphism, and encapsulation.",
            score=85.0
        ),
        PreviousInteraction(
            sequence_number=2,
            question="Design rate limiter.",
            category="Problem Solving",
            topic="System Design",
            difficulty="MEDIUM",
            answer="I use token bucket with Redis for distributed rate limiting.",
            score=80.0
        )
    ]
    
    skill_res = skill_agent.assess_skills(
        job_role="Software Developer",
        interview_type="Mixed",
        interactions=interactions
    )
    assert skill_res.technical_score > 0
    assert skill_res.overall_score > 0

    career_res = career_agent.evaluate_readiness(
        job_role="Software Developer",
        technical_score=skill_res.technical_score,
        problem_solving_score=skill_res.problem_solving_score,
        communication_score=skill_res.communication_score,
        behavioral_score=skill_res.behavioral_score,
        strengths=skill_res.strengths,
        weaknesses=skill_res.weaknesses,
        skill_gaps=skill_res.skill_gaps
    )
    assert career_res.readiness_score > 0
    assert career_res.readiness_level in ["NOT READY", "BEGINNER READY", "INTERVIEW READY", "JOB READY"]
    assert len(career_res.recommendations) > 0
