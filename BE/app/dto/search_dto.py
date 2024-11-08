from pydantic import BaseModel
from typing import List, Dict

class TagImageResponse(BaseModel):
    tags: List[str] 
    images: Dict[str, str]
    
    
class ImageSearchResponse(BaseModel):
    images: Dict[str, str]


class SearchCondition(BaseModel):
    and_condition: List[str] = []
    or_condition: List[str] = []
    not_condition: List[str] = []
    
    class Config:
        json_schema_extra = {
            "example": {
                "and_condition": ["cat", "Seoul"],
                "or_condition": ["2024_11"],
                "not_condition": ["Zone A"]
            }
        }


class SearchRequest(BaseModel):
    conditions: List[SearchCondition]

    class Config:
        json_schema_extra = {
            "example": {
                "conditions": [
                    {
                        "and_condition": ["cat", "Seoul"],
                        "or_condition": ["2024_11"],
                        "not_condition": ["Zone A"]
                    },
                    {
                        "and_condition": ["dog", "Busan"],
                        "or_condition": [],
                        "not_condition": ["Zone B"]
                    }
                ]
            }
        }