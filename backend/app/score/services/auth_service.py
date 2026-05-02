from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import get_settings
from app.database import get_database
from app.score.models.user_model import UserCreate, UserInDB, UserResponse, TokenResponse
from bson import ObjectId

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


async def register_user(user_data: UserCreate) -> TokenResponse:
    db = get_database()

    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise ValueError("Email already registered")

    # Create user document
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "hashed_password": hash_password(user_data.password),
        "created_at": datetime.utcnow(),
    }

    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # Generate token
    token = create_access_token({"sub": user_id, "email": user_data.email})

    user_response = UserResponse(
        id=user_id,
        name=user_data.name,
        email=user_data.email,
        created_at=user_doc["created_at"],
    )

    return TokenResponse(access_token=token, user=user_response)


async def login_user(email: str, password: str) -> TokenResponse:
    db = get_database()

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise ValueError("Invalid email or password")

    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id, "email": email})

    user_response = UserResponse(
        id=user_id,
        name=user["name"],
        email=user["email"],
        created_at=user["created_at"],
    )

    return TokenResponse(access_token=token, user=user_response)


async def get_user_by_id(user_id: str) -> UserResponse:
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise ValueError("User not found")

    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        created_at=user["created_at"],
    )
