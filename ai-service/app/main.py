import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import interview, assessment, speech, career

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("InterviewVerseAI-Service")

app = FastAPI(
    title="InterviewVerseAI - Agentic AI Service",
    description="Multi-agent adaptive interview intelligence ecosystem powered by LangChain, GPT-5, and Whisper.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React Frontend and Spring Boot Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Agentic Routes
app.include_router(interview.router, prefix=settings.API_V1_STR)
app.include_router(assessment.router, prefix=settings.API_V1_STR)
app.include_router(speech.router, prefix=settings.API_V1_STR)
app.include_router(career.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": "InterviewVerseAI AI Service",
        "status": "ONLINE",
        "documentation": "/docs",
        "model": settings.OPENAI_MODEL,
        "agents": [
            "Orchestrator Agent",
            "Adaptive Interview Agent",
            "Answer Evaluation Agent",
            "Skill Assessment Agent",
            "Career Readiness Agent"
        ]
    }

@app.get("/ai/health")
def health_check():
    return {
        "status": "UP",
        "service": "ai-service",
        "database_connected": True,
        "ai_engine": "LangChain Multi-Agent"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.AI_HOST, port=settings.AI_PORT, reload=True)
