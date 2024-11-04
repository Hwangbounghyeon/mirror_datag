from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

mongo_url = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(mongo_url)
database = client.get_database("S11P31S108")

collection_metadata = database.get_collection("metadata")
collection_features = database.get_collection("features")
collection_histories = database.get_collection("histories")
collection_permissions = database.get_collection("permissions")
collection_project_history = database.get_collection("projectHistory")
collection_tagimages = database.get_collection("tagImages")
collection_images = database.get_collection("images")

def get_database_mongodb():
    try:
        client.admin.command('ping')
        print("Successfully connected to MongoDB")
    except Exception as e:
        print(e)