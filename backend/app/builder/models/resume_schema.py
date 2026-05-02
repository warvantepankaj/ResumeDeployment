# app/schemas/resume_schema.py

from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class ResumeBase(BaseModel):
    title: Optional[str] = "Untitled Resume"
    data: Optional[Dict[str, Any]] = {}
    status: Optional[str] = "pending"
    progress: Optional[int] = 0


class ResumeCreate(BaseModel):
    userId: str
    title: str


class ResumeUpdate(BaseModel):
    data: Optional[Dict[str, Any]] = None
    status: Optional[str] = None
    progress: Optional[int] = None


class ResumeResponse(ResumeBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True