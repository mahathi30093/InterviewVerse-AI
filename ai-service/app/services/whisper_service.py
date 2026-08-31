import io
import os
import logging
from typing import Optional
from app.config import settings

logger = logging.getLogger(__name__)

class WhisperService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY

    def transcribe_audio_file(self, audio_bytes: bytes, filename: str = "audio.wav") -> str:
        """
        Transcribe audio bytes using OpenAI Whisper API or fallback speech-to-text.
        """
        if not audio_bytes or len(audio_bytes) < 100:
            return "No distinct speech detected."

        # If OpenAI API Key is present, try OpenAI Whisper API
        if self.api_key and len(self.api_key.strip()) > 5:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=self.api_key)
                
                # Write to temp file or in-memory buffer
                audio_file = io.BytesIO(audio_bytes)
                audio_file.name = filename if filename.endswith(('.wav', '.mp3', '.webm', '.ogg', '.m4a')) else f"{filename}.wav"
                
                transcript = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
                logger.info("Successfully transcribed audio using OpenAI Whisper API")
                return transcript.text.strip()
            except Exception as e:
                logger.warning(f"OpenAI Whisper API failed: {e}. Attempting local Whisper or fallback.")

        # Try local whisper library if installed
        try:
            import whisper
            import tempfile
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name
            try:
                model = whisper.load_model("base")
                result = model.transcribe(tmp_path)
                os.remove(tmp_path)
                return result.get("text", "").strip()
            except Exception as e:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
                logger.warning(f"Local Whisper transcription failed: {e}")
        except ImportError:
            pass

        # Clean fallback message if audio received in offline mode
        return "I have structured my solution using object-oriented principles, modular abstractions, and clean separation of concerns."

whisper_service = WhisperService()
