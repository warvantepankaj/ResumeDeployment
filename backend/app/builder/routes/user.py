from fastapi import APIRouter, HTTPException
from app.database import get_database

router = APIRouter()

@router.post("/user")
async def create_user(user: dict):
    db = get_database()

    try:
        existing = await db.users.find_one({"_id": user["id"]})

        if not existing:
            await db.users.insert_one({
                "_id": user["id"],
                "email": user.get("email"),
                "name": user.get("name"),
                "image_url": user.get("image_url")
            })

        return {"message": "User stored"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))