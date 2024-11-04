from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from bson import ObjectId

class Feature(BaseModel):
    projectId: str
    feature: List[List[float]]
    createdAt: datetime