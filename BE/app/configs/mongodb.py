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
collection_project_histories = database.get_collection("projectHistories")
collection_upload_batches = database.get_collection("uploadBatches")
collection_user_upload_batches = database.get_collection("userUploadBatches")
collection_images = database.get_collection("images")
collection_projects = database.get_collection("projects")

def get_database_mongodb():
    try:
        client.admin.command('ping')
        print("Successfully connected to MongoDB")
    except Exception as e:
        print(e)