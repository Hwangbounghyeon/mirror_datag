from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class UploadBatch(BaseModel):
    id: Optional[ObjectId] = Field(None, alias="_id")
    userId: int
    projectId: str
    isDone: bool
    createdAt: datetime
    updatedAt: datetime