import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "InterviewVerseAI - AI Service"
    API_V1_STR: str = "/ai"
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o")
    AI_HOST: str = "0.0.0.0"
    AI_PORT: int = 8000
    DATA_PATH: str = os.getenv("DATA_PATH", "../data/questions")
    
    model_config = SettingsConfigDict(env_file=".env", extra="allow")

settings = Settings()
