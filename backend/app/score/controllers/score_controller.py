from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
import traceback
from typing import Optional
from app.score.models.score_model import ScoreResponse, ScoreRequest
from app.score.models.resume_model import ResumeData
from app.score.services.score_service import score_resume_data
from app.score.services.resume_service import get_resume_by_id
from app.score.services.parser_service import extract_text_from_file
from app.score.services.llm_service import parse_resume_text
from app.score.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/score", tags=["Resume Scoring"])


@router.post("", response_model=ScoreResponse)
async def score_uploaded_resume(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
):
    try:
        contents = await file.read()
        text = extract_text_from_file(contents, file.filename)

        print("✅ Extracted text length:", len(text))  # debug

        parsed = await parse_resume_text(text)
        print("✅ Parsed data:", parsed)  # debug

        resume_data = ResumeData(**parsed)

        result = await score_resume_data(
            user_id="test-user",   # since auth removed
            resume_data=resume_data,
            job_description=job_description,
        )
        return result

    except Exception as e:
        print("🔥 ERROR:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/from-db/{resume_id}", response_model=ScoreResponse)
async def score_saved_resume(
    resume_id: str,
    request: ScoreRequest = None,
):
    """Score a resume from the user's saved resumes in the database."""
    try:
        resume = await get_resume_by_id(resume_id, current_user["user_id"])

        jd = request.job_description if request else None

        result = await score_resume_data(
            user_id=current_user["user_id"],
            resume_data=resume.data,
            resume_id=resume_id,
            job_description=jd,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to score resume: {str(e)}"
        )


@router.post("/parse-for-scoring")
async def parse_resume_for_scoring(
    file: UploadFile = File(...),
):
    print("Scoring.....")
    """Parse a resume file and return structured data (for autofill after scoring)."""
    try:
        contents = await file.read()
        text = extract_text_from_file(contents, file.filename)
        parsed = await parse_resume_text(text)
        return {"data": parsed, "raw_text": text}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
