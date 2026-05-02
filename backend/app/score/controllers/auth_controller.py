from fastapi import APIRouter, HTTPException
from app.score.models.user_model import UserCreate, UserLogin, TokenResponse, UserResponse
from app.score.services.auth_service import register_user, login_user, get_user_by_id
from app.score.middleware.auth_middleware import get_current_user
from fastapi import Depends

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    try:
        return await register_user(user_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    try:
        return await login_user(user_data.email, user_data.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    try:
        return await get_user_by_id(current_user["user_id"])
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
