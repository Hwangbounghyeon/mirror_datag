from pydantic import BaseModel
from typing import List

class TagImageResponseDTO(BaseModel):
    tags: List[str] 
    paths: List[str]


class ConditionDTO(BaseModel):
    and_condition: List[str] = []
    or_condition: List[str] = []
    not_condition: List[str] = []

class SearchConditionDTO(BaseModel):
    conditions: List[ConditionDTO] | None = None
    
    
"""SearchConditionDTO Request Body 구조
    
    {
        "conditions": [
            {"and_condition": ["tag1", "tag2", ...]},
            {"or_condition": ["tag3", "tag4", ...]},
            {"not_condition": ["tag5", "tag6", ...]}
        ]
    }
    """