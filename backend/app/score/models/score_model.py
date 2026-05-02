from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ScoreCategory(BaseModel):
    name: str
    score: int = Field(..., ge=0, le=100)
    feedback: str
    suggestions: List[str] = []


class ScoreResponse(BaseModel):
    id: str
    resume_id: Optional[str] = None
    user_id: str
    overall_score: int = Field(..., ge=0, le=100)
    categories: List[ScoreCategory]
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    ats_friendly: bool
    created_at: datetime


class ScoreRequest(BaseModel):
    job_description: Optional[str] = None
