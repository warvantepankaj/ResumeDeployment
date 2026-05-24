from fastapi import APIRouter, HTTPException
from app.database import get_database
from datetime import datetime
import uuid

router = APIRouter()

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