from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import time

router = APIRouter()

class ModerationRequest(BaseModel):
    content: str
    content_type: str = "text"  # text, image, video
    user_id: Optional[str] = None

class ModerationResponse(BaseModel):
    is_appropriate: bool
    confidence: float
    flags: List[str]
    processing_time: float

@router.post("/check-content", response_model=ModerationResponse)
async def check_content(request: ModerationRequest):
    """Check if content is appropriate"""
    start_time = time.time()
    
    # Mock moderation logic
    content = request.content.lower()
    flags = []
    
    # Simple keyword-based moderation
    inappropriate_words = ["spam", "inappropriate", "offensive"]
    for word in inappropriate_words:
        if word in content:
            flags.append(f"contains_{word}")
    
    is_appropriate = len(flags) == 0
    confidence = 0.95 if is_appropriate else 0.85
    
    processing_time = time.time() - start_time
    
    return ModerationResponse(
        is_appropriate=is_appropriate,
        confidence=confidence,
        flags=flags,
        processing_time=processing_time
    )

@router.get("/status")
async def moderation_status():
    """Get moderation service status"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "models_loaded": True
    } 