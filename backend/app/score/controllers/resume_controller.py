from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import Response
from typing import List
from app.score.models.resume_model import (
    ResumeCreate,
    ResumeUpdate,
    ResumeResponse,
    ResumeListResponse,
)
from app.score.services.resume_service import (
    create_resume,
    get_resumes,
    get_resume_by_id,
    update_resume,
    delete_resume,
)
from app.score.services.parser_service import extract_text_from_file
from app.score.services.llm_service import parse_resume_text
from app.score.services.pdf_service import generate_docx, generate_pdf
from app.score.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])


@router.post("", response_model=ResumeResponse)
async def create(
    resume_data: ResumeCreate, current_user: dict = Depends(get_current_user)
):
    try:
        return await create_resume(current_user["user_id"], resume_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=List[ResumeResponse])
async def list_all(current_user: dict = Depends(get_current_user)):
    return await get_resumes(current_user["user_id"])


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_one(resume_id: str, current_user: dict = Depends(get_current_user)):
    try:
        return await get_resume_by_id(resume_id, current_user["user_id"])
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{resume_id}", response_model=ResumeResponse)
async def update(
    resume_id: str,
    update_data: ResumeUpdate,
    current_user: dict = Depends(get_current_user),
):
    try:
        return await update_resume(resume_id, current_user["user_id"], update_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{resume_id}")
async def delete(resume_id: str, current_user: dict = Depends(get_current_user)):
    try:
        await delete_resume(resume_id, current_user["user_id"])
        return {"message": "Resume deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{resume_id}/download/docx")
async def download_docx(
    resume_id: str, current_user: dict = Depends(get_current_user)
):
    try:
        resume = await get_resume_by_id(resume_id, current_user["user_id"])
        docx_bytes = generate_docx(resume.data)
        filename = f"{resume.title.replace(' ', '_')}.docx"
        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{resume_id}/download/pdf")
async def download_pdf(
    resume_id: str, current_user: dict = Depends(get_current_user)
):
    try:
        resume = await get_resume_by_id(resume_id, current_user["user_id"])
        pdf_bytes = generate_pdf(resume.data)
        filename = f"{resume.title.replace(' ', '_')}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/parse")
async def parse_resume(
    file: UploadFile = File(...), current_user: dict = Depends(get_current_user)
):
    """Upload and parse a resume file to extract structured data."""
    try:
        contents = await file.read()
        text = extract_text_from_file(contents, file.filename)
        parsed_data = await parse_resume_text(text)
        return {"data": parsed_data, "raw_text": text}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")
