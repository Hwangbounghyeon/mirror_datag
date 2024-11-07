from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import numpy as np

# 모델 추론 공통 Request Dto
class DimensionReductionRequest(BaseModel):
    algorithm: str
    project_id: str
    history_name: str
    is_private: bool
    selected_tags: List[List[str]]
    image_ids: List[str]

# 모델 추론 공통 Response Dto
class DimensionReductionResponse(BaseModel):
    history_id: str
    project_id: str
    user_id: int
    history_name: str
