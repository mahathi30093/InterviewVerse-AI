from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/ai/health")
    assert response.status_code == 200
    assert response.json()["status"] == "UP"

def test_generate_question_api():
    payload = {
        "target_role": "Python Developer",
        "interview_type": "Technical",
        "category": "Technical",
        "difficulty": "EASY",
        "sequence_number": 1
    }
    response = client.post("/ai/generate-question", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "question" in data
    assert data["difficulty"] == "EASY"

def test_analyze_answer_api():
    payload = {
        "question": "What is Python GIL?",
        "candidate_answer": "GIL is the Global Interpreter Lock which prevents multiple threads from executing Python bytecodes at once.",
        "job_role": "Python Developer",
        "skill": "Python",
        "category": "Technical",
        "difficulty": "MEDIUM"
    }
    response = client.post("/ai/analyze-answer", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["score"] > 0
    assert "feedback" in data

def test_career_readiness_api():
    payload = {
        "job_role": "Software Developer",
        "technical_score": 85.0,
        "problem_solving_score": 80.0,
        "communication_score": 75.0,
        "behavioral_score": 80.0
    }
    response = client.post("/ai/career-readiness", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["readiness_level"] == "JOB READY"
    assert data["readiness_score"] == 80.75
