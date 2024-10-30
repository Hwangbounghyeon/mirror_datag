from pydantic import BaseModel
from datetime import datetime
from typing import List

class AccessControl(BaseModel):
    view_users: List[str]
    edit_users: List[str]
    view_departments: List[str]
    edit_departments: List[str]

class ProjectRequest(BaseModel):
    user_id: int
    project_name: str
    model_name: str
    description: str
    accesscontrol: AccessControl
    is_private: int

class ShowProjectList(BaseModel):
    user_id: int
    department_id: int
    select_department: str = None
    selelct_model_name: str = None
