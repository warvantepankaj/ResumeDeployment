from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_database
from datetime import datetime
import uuid
from playwright.async_api import async_playwright
from fastapi.responses import StreamingResponse
import io

router = APIRouter()
class ExportRequest(BaseModel):
    htmlContent: str

@router.post("/resume")
async def create_resume(user: dict):
    db = get_database()

    if not user.get("userId") or not user.get("title"):
        raise HTTPException(status_code=422, detail="User ID and title required")

    existing_user = await db.users.find_one({"_id": user["userId"]})

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    resume_id = str(uuid.uuid4())

    await db.resumes.insert_one({
        "_id": resume_id,
        "user_id": user["userId"],
        "title": user["title"],
        "data": {},
        "status": "pending",
        "progress": 0,
        "currentStep": 0,
        "showPreview": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })

    return {
        "message": "Resume created successfully",
        "id": resume_id
    }


@router.put("/resume/{id}")
async def update_resume(id: str, payload: dict):
    db = get_database()

    existing = await db.resumes.find_one({"_id": id})

    if not existing:
        raise HTTPException(status_code=404, detail="Resume not found")

    update_data = {
        "updated_at": datetime.utcnow()
    }

    if "data" in payload:
        update_data["data"] = payload["data"]

    if "status" in payload:
        update_data["status"] = payload["status"]

    if "progress" in payload:
        update_data["progress"] = payload["progress"]

    if "currentStep" in payload:
        update_data["currentStep"] = payload["currentStep"]

    if "showPreview" in payload:
        update_data["showPreview"] = payload["showPreview"]

    await db.resumes.update_one(
        {"_id": id},
        {"$set": update_data}
    )

    updated = await db.resumes.find_one({"_id": id})

    return {
        "success": True,
        "message": "Updated successfully",
        "data": updated
    }


@router.delete("/resume/{id}")
async def delete_resume(id: str):
    db = get_database()

    result = await db.resumes.delete_one({"_id": id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {
        "success": True,
        "message": "Deleted successfully",
        "id": id
    }



@router.get("/resume/{user_id}")
async def get_user_resumes(user_id: str):
    db = get_database()

    cursor = db.resumes.find({"user_id": user_id}).sort("created_at", -1)

    resumes = []

    async for doc in cursor:
        resumes.append({
            "id": str(doc["_id"]),   
            "userId": doc["user_id"],
            "title": doc["title"],
            "data": doc["data"],
            "status": doc["status"],
            "progress": doc["progress"],
            # "currentStep": doc.get("currentStep", 0),
            # "showPreview": doc.get("showPreview", False),
            "createdAt": doc["created_at"],
            "updatedAt": doc["updated_at"]
        })
    return resumes



@router.get("/resume/single/{id}")
async def get_single_resume(id: str):
    db = get_database()

    resume = await db.resumes.find_one({"_id": id})

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {
        "success": True,
        "data": resume["data"],
        "currentStep": resume.get("currentStep", 0),
        "showPreview": resume.get("showPreview", False)
    }


@router.post("/resume/export/pdf")
async def export_resume_pdf(body: ExportRequest):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            full_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body {{ margin: 0; padding: 0; background: white; }}
                @page {{ size: A4; margin: 0; }}
              </style>
            </head>
            <body>
              {body.htmlContent}
            </body>
            </html>
            """

            await page.set_content(full_html, wait_until="networkidle")

            pdf_bytes = await page.pdf(
                format="A4",
                print_background=True,
                margin={"top": "0", "bottom": "0", "left": "0", "right": "0"}
            )

            await browser.close()

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=resume.pdf"}
        )

    except Exception as e:
        print("PDF ERROR:", str(e))
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")