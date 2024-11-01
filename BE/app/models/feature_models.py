from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from bson import ObjectId

class Feature(BaseModel):
    id: Optional[ObjectId] = Field(None, alias="_id")
    porjectId: str
    createdAt: datetime
    feature: List[List[float]]