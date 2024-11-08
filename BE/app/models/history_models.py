from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime
from bson import ObjectId

class Parameters(BaseModel):
    selectedAlgorithm: str
    selectedTags: List[List[str]]

class ReductionResults(BaseModel):
    imageId: str
    imageUrl: str
    features: List[float]
    predictions: Any

class HistoryData(BaseModel):
    userId: int
    projectId: str
    isPrivate: bool
    historyName: str
    isDone: bool
    parameters: Optional[Parameters] = None
    results: Optional[List[ReductionResults]] = None
    createdAt: datetime
    updatedAt: datetime