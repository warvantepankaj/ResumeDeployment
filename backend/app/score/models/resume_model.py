from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Education(BaseModel):
    institution: str = ""
    degree: str = ""
    field_of_study: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: str = ""
    description: str = ""


class Experience(BaseModel):
    company: str = ""
    position: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    description: str = ""
    highlights: List[str] = []


class Project(BaseModel):
    name: str = ""
    description: str = ""
    technologies: List[str] = []
    url: str = ""
    start_date: str = ""
    end_date: str = ""


class Certification(BaseModel):
    name: str = ""
    issuer: str = ""
    date: str = ""
    url: str = ""


class PersonalInfo(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""
    summary: str = ""


class ResumeData(BaseModel):
    personal_info: PersonalInfo = Field(default_factory=PersonalInfo)
    education: List[Education] = []
    experience: List[Experience] = []
    skills: List[str] = []
    projects: List[Project] = []
    certifications: List[Certification] = []
    languages: List[str] = []
    interests: List[str] = []


class ResumeCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    template: str = "modern"
    data: ResumeData = Field(default_factory=ResumeData)


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    template: Optional[str] = None
    data: Optional[ResumeData] = None


class ResumeResponse(BaseModel):
    id: str
    user_id: str
    title: str
    template: str
    data: ResumeData
    created_at: datetime
    updated_at: datetime


class ResumeListResponse(BaseModel):
    resumes: List[ResumeResponse]
    total: int
