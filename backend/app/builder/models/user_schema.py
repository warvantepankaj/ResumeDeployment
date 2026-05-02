# app/schemas/user_schema.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    image_url: Optional[str] = None


class UserCreate(UserBase):
    id: str   # Clerk user.id


class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True