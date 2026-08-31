import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.models.schemas import TranscriptionResponse
from app.services.whisper_service import whisper_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["Speech & Voice"])

@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: Optional[UploadFile] = File(None),
    fallback_text: Optional[str] = Form(None)
):
    """
    Transcribe audio recording from candidate using Whisper.
    Fallback safely to provided text if audio cannot be transcribed.
    """
    try:
        if file:
            audio_bytes = await file.read()
            text = whisper_service.transcribe_audio_file(audio_bytes, file.filename or "audio.wav")
            return TranscriptionResponse(text=text, confidence=0.95, source="whisper")
        elif fallback_text:
            return TranscriptionResponse(text=fallback_text.strip(), confidence=1.0, source="text_fallback")
        else:
            raise HTTPException(status_code=400, detail="No audio file or text provided.")
    except Exception as e:
        logger.error(f"Error in transcription endpoint: {e}")
        if fallback_text:
            return TranscriptionResponse(text=fallback_text.strip(), confidence=0.8, source="fallback_recovery")
        return TranscriptionResponse(text="Voice transcription failed, switched to text fallback.", confidence=0.5, source="error_fallback")
