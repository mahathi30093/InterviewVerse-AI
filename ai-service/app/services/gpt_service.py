import os
import json
import re
import logging
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class GPTService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model_name = settings.OPENAI_MODEL
        self.llm = None
        self._initialize_llm()

    def _initialize_llm(self):
        if self.api_key and len(self.api_key.strip()) > 5:
            try:
                from langchain_openai import ChatOpenAI
                self.llm = ChatOpenAI(
                    model=self.model_name,
                    api_key=self.api_key,
                    temperature=0.7,
                    max_tokens=1500
                )
                logger.info(f"Initialized ChatOpenAI with model {self.model_name}")
            except Exception as e:
                logger.warning(f"Could not initialize ChatOpenAI: {e}. Falling back to offline engine.")
                self.llm = None
        else:
            logger.info("No OPENAI_API_KEY provided. Utilizing intelligent local heuristic engine.")
            self.llm = None

    def clean_json_response(self, text: str) -> Dict[str, Any]:
        """Extract and safely parse JSON from LLM markdown/raw text."""
        try:
            return json.loads(text)
        except Exception:
            # Try to match ```json ... ``` or ``` ... ```
            json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
            if json_match:
                try:
                    return json.loads(json_match.group(1).strip())
                except Exception:
                    pass
            # Try to find first { and last }
            first_brace = text.find("{")
            last_brace = text.rfind("}")
            if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
                try:
                    return json.loads(text[first_brace:last_brace+1])
                except Exception:
                    pass
            raise ValueError(f"Failed to parse valid JSON from text: {text[:200]}...")

    def invoke(self, prompt: str) -> Optional[str]:
        """Directly invoke LangChain LLM if available."""
        if not self.llm:
            return None
        try:
            response = self.llm.invoke(prompt)
            return response.content if hasattr(response, "content") else str(response)
        except Exception as e:
            logger.error(f"GPT API call failed: {e}. Utilizing fallback generation.")
            return None

gpt_service = GPTService()
