from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from app.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient = None
db = None


# ✅ Connect to MongoDB Atlas
async def connect_to_mongo():
    global client, db

    client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=30000,
    )

    db = client[settings.DATABASE_NAME]

    # Test connection
    await client.admin.command("ping")

    # ✅ Indexes (important for performance)
    await db.users.create_index("email", unique=True)
    await db.resumes.create_index("user_id")

    print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")


# ✅ Close connection
async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("❌ MongoDB connection closed")


# ✅ Dependency (used in routes/services)
def get_database():
    return db