from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

client = AsyncIOMotorClient(os.getenv("MONGO_URL"))

def get_database_mongodb():
    try:
        client.admin.command('ping')
        print("Successfully connected to MongoDB")
    except Exception as e:
        print(e)
        
