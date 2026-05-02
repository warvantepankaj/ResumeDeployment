from datetime import datetime
from typing import Optional
from bson import ObjectId
from app.database import get_database
from app.score.models.resume_model import ResumeData
from app.score.models.score_model import ScoreResponse, ScoreCategory
from app.score.services.llm_service import score_resume


async def score_resume_data(
    user_id: str,
    resume_data: ResumeData,
    resume_id: Optional[str] = None,
    job_description: Optional[str] = None,
) -> ScoreResponse:
    """Score resume data and save the result."""
    db = get_database()

    # Get LLM analysis
    analysis = await score_resume(resume_data, job_description)

    # Build categories
    categories = [
        ScoreCategory(
            name=cat["name"],
            score=cat["score"],
            feedback=cat["feedback"],
            suggestions=cat.get("suggestions", []),
        )
        for cat in analysis.get("categories", [])
    ]

    now = datetime.utcnow()

    # Save score to DB
    score_doc = {
        "user_id": user_id,
        "resume_id": resume_id,
        "overall_score": analysis["overall_score"],
        "categories": [c.model_dump() for c in categories],
        "summary": analysis["summary"],
        "strengths": analysis.get("strengths", []),
        "weaknesses": analysis.get("weaknesses", []),
        "recommendations": analysis.get("recommendations", []),
        "ats_friendly": analysis.get("ats_friendly", False),
        "created_at": now,
    }

    result = await db.scores.insert_one(score_doc)

    return ScoreResponse(
        id=str(result.inserted_id),
        resume_id=resume_id,
        user_id=user_id,
        overall_score=analysis["overall_score"],
        categories=categories,
        summary=analysis["summary"],
        strengths=analysis.get("strengths", []),
        weaknesses=analysis.get("weaknesses", []),
        recommendations=analysis.get("recommendations", []),
        ats_friendly=analysis.get("ats_friendly", False),
        created_at=now,
    )
