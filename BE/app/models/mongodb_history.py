from pydantic import BaseModel, Field
from typing import List

class Parameters(BaseModel):
    selectedAlgorithm: str
    selectedTags: List[List[str]]

class ReductionResults(BaseModel):
    imageIds: List[int]
    reductionFeatures: List[List[float]]

class HistoryData(BaseModel):
    parameters: Parameters
    results: ReductionResults
