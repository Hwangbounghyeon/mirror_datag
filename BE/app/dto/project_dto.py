from pydantic import BaseModel
from datetime import datetime
from typing import List

class AccessControl(BaseModel):
    users: List[str]
    departments: List[str]

class ProjectRequest(BaseModel):
    user_id: int
    name: str
    description: str
    accesscontrol: AccessControl
    is_private: int