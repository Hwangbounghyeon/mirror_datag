from pydantic import BaseModel
from typing import List, Dict

class TagSearchParams(BaseModel):
    and_tags: List[str] = []
    or_tags: List[str] = []
    not_tags: List[str] = []

class TagImageResponseDTO(BaseModel):
    tags: List[str] 
    images: List[Dict[str, str]]
    
class ImageSearchResponseDTO(BaseModel):
    images: Dict[str, str]

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
    
# class SearchConditionDTO(BaseModel):
#     conditions: List[ConditionDTO] | None = None
#     page: int = 1
#     page_size: int = 20
#     sort_by: str = "created_at"
#     sort_order: str = "desc"