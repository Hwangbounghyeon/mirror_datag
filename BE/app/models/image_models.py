from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class ImageData(BaseModel):
    id: Optional[ObjectId] = Field(None, alias="_id")
    imageId: str
    imageName: str
    metadataId: Optional[ObjectId]
    featureId: Optional[ObjectId]
    createdAt: datetime
    updatedAt: datetime