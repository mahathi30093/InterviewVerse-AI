from typing import Tuple, List, Dict, Any

class ScoringService:
    @staticmethod
    def calculate_career_readiness(
        technical: float,
        problem_solving: float,
        communication: float,
        behavioral: float
    ) -> Tuple[float, str]:
        """
        Calculate overall readiness score and bucket level.
        Formula: technical * 0.35 + problem_solving * 0.25 + communication * 0.20 + behavioral * 0.20
        """
        overall = round(
            (float(technical) * 0.35) +
            (float(problem_solving) * 0.25) +
            (float(communication) * 0.20) +
            (float(behavioral) * 0.20),
            2
        )
        
        # Determine readiness level
        if overall >= 80.0:
            level = "JOB READY"
        elif overall >= 60.0:
            level = "INTERVIEW READY"
        elif overall >= 40.0:
            level = "BEGINNER READY"
        else:
            level = "NOT READY"
            
        return overall, level

    @staticmethod
    def compute_next_difficulty(last_score: float, current_difficulty: str) -> Tuple[str, str]:
        """
        Difficulty rules:
        Score >= 80: Increase difficulty (EASY -> MEDIUM -> HARD)
        Score 60-79: Maintain difficulty
        Score < 60: Decrease difficulty (HARD -> MEDIUM -> EASY)
        Never exceed HARD, never fall below EASY.
        """
        current_difficulty = (current_difficulty or "EASY").upper()
        
        if last_score >= 80.0:
            if current_difficulty == "EASY":
                return "MEDIUM", f"Score of {last_score:.1f}% exceeds 80%. Increasing difficulty to Medium."
            elif current_difficulty == "MEDIUM":
                return "HARD", f"Score of {last_score:.1f}% exceeds 80%. Increasing difficulty to Hard."
            else:
                return "HARD", f"Score of {last_score:.1f}% is outstanding. Maintaining peak difficulty (Hard)."
        elif last_score >= 60.0:
            return current_difficulty, f"Score of {last_score:.1f}% is solid (60-79%). Maintaining {current_difficulty} difficulty."
        else:
            if current_difficulty == "HARD":
                return "MEDIUM", f"Score of {last_score:.1f}% is below 60%. Decreasing difficulty to Medium."
            elif current_difficulty == "MEDIUM":
                return "EASY", f"Score of {last_score:.1f}% is below 60%. Decreasing difficulty to Easy."
            else:
                return "EASY", f"Score of {last_score:.1f}% is below 60%. Maintaining foundational level (Easy)."

scoring_service = ScoringService()
