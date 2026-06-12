from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Mongo config
from app.config import get_settings
from app.database import connect_to_mongo, close_mongo_connection

# Builder routes
from app.builder.routes import resume as builder_resume
from app.builder.routes import user as builder_user

# Score module routes (from teammate)
from app.score.controllers.auth_controller import router as auth_router
from app.score.controllers.resume_controller import router as score_resume_router
from app.score.controllers.score_controller import router as score_router

import asyncio
import sys

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
settings = get_settings()


# ✅ Lifespan for MongoDB
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


# ✅ App initialization
app = FastAPI(
    title="Resume Builder & Scorer API",
    description="Combined Builder + Score backend using MongoDB Atlas",
    version="1.0.0",
    lifespan=lifespan,
)


# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or settings.FRONTEND_URL if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ ROUTES

# Builder module
app.include_router(builder_resume.router, prefix="/builder")
app.include_router(builder_user.router, prefix="/builder")

# Score module
app.include_router(auth_router)
app.include_router(score_resume_router)
app.include_router(score_router)


# ✅ Root
@app.get("/")
async def root():
    return {
        "message": "Resume Builder & Scorer API",
        "modules": ["builder", "score"],
        "docs": "/docs",
    }


# ✅ Health Check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}