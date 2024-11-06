from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List, Dict, Optional, Any

# 제너릭 타입 정의
T = TypeVar('T')

# 기본 응답용 DTO
class CommonResponse(BaseModel, Generic[T]):
    status: int
    data: Optional[T] = None