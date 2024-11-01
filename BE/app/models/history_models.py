from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class Parameters(BaseModel):
    selectedAlgorithm: str
    selectedTags: List[List[str]]

class ReductionResults(BaseModel):
    imageIds: List[int]
    reductionFeatures: List[List[float]]

class HistoryData(BaseModel):
    id: Optional[ObjectId] = Field(None, alias="_id")
    userId: int
    isPrivate: bool
    historyName: str
    isDone: bool
    parameters: Parameters
    results: ReductionResults
    createdAt: datetime
    updatedAt: datetime