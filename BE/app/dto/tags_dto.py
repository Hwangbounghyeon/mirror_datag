from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict
from models.mariadb_image import TagType
        
class TagImageResponseDTO(BaseModel):
    tags: Dict[TagType, List[str]]  # 각 태그의 타입을 Key로 가지는 Dict 구조
    paths: List[str] # 전체 이미지 S3 경로 목록
        
class DateFilterDTO(BaseModel):
    year: str | None = None
    month: str | None = None


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