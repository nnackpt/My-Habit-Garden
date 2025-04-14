from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

cliend = AsyncIOMotorClient(MONGO_URI)
db = cliend[DATABASE_NAME]

users_collection = db["users"]
habits_collection = db["habits"]