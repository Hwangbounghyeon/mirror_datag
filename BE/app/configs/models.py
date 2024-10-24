from motor.motor_asyncio import AsyncIOMotorClient
import os

client = AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.get_database("college")
student_collection = db.get_collection("students")