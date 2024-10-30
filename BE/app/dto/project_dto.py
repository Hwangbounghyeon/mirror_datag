from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Project 생성 요청 DTO
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
    
# Project 조회 요청 DTO
class ShowProjectList(BaseModel):
    user_id: int
    department_id: int
    select_department: Optional[str] = None
    select_model_name: Optional[str] = None
    
# User 응답 DTO
class UserResponse(BaseModel):
    user_id: int
    nickname: str
    email: str

# Department 응답 DTO
class DepartmentResponse(BaseModel):
    department_id: int
    department_name: str
