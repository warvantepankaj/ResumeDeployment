from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from app.database import get_database
from app.score.models.resume_model import (
    ResumeCreate,
    ResumeUpdate,
    ResumeResponse,
    ResumeData,
)


async def create_resume(user_id: str, resume_data: ResumeCreate) -> ResumeResponse:
    db = get_database()
    now = datetime.utcnow()

    doc = {
        "user_id": user_id,
        "title": resume_data.title,
        "template": resume_data.template,
        "data": resume_data.data.model_dump(),
        "created_at": now,
        "updated_at": now,
    }

    result = await db.resumes.insert_one(doc)

    return ResumeResponse(
        id=str(result.inserted_id),
        user_id=user_id,
        title=resume_data.title,
        template=resume_data.template,
        data=resume_data.data,
        created_at=now,
        updated_at=now,
    )


async def get_resumes(user_id: str) -> List[ResumeResponse]:
    db = get_database()
    cursor = db.resumes.find({"user_id": user_id}).sort("updated_at", -1)
    resumes = []

    async for doc in cursor:
        resumes.append(
            ResumeResponse(
                id=str(doc["_id"]),
                user_id=doc["user_id"],
                title=doc["title"],
                template=doc["template"],
                data=ResumeData(**doc["data"]),
                created_at=doc["created_at"],
                updated_at=doc["updated_at"],
            )
        )

    return resumes


async def get_resume_by_id(resume_id: str, user_id: str) -> ResumeResponse:
    db = get_database()
    doc = await db.resumes.find_one({"_id": ObjectId(resume_id), "user_id": user_id})

    if not doc:
        raise ValueError("Resume not found")

    return ResumeResponse(
        id=str(doc["_id"]),
        user_id=doc["user_id"],
        title=doc["title"],
        template=doc["template"],
        data=ResumeData(**doc["data"]),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


async def update_resume(
    resume_id: str, user_id: str, update_data: ResumeUpdate
) -> ResumeResponse:
    db = get_database()

    update_fields = {"updated_at": datetime.utcnow()}
    if update_data.title is not None:
        update_fields["title"] = update_data.title
    if update_data.template is not None:
        update_fields["template"] = update_data.template
    if update_data.data is not None:
        update_fields["data"] = update_data.data.model_dump()

    result = await db.resumes.update_one(
        {"_id": ObjectId(resume_id), "user_id": user_id}, {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise ValueError("Resume not found")

    return await get_resume_by_id(resume_id, user_id)


async def delete_resume(resume_id: str, user_id: str) -> bool:
    db = get_database()
    result = await db.resumes.delete_one(
        {"_id": ObjectId(resume_id), "user_id": user_id}
    )

    if result.deleted_count == 0:
        raise ValueError("Resume not found")

    return True
