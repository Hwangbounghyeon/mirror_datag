from pydantic import BaseModel
from typing import List
from datetime import datetime

class Feature(BaseModel):
  createdAt: datetime
  feature: List[List[float]]