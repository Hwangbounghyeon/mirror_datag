from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Project 생성 요청 DTO
class AccessControl(BaseModel):
    view_users: List[str] = None
    edit_users: List[str] = None
    view_departments: List[str] = None
    edit_departments: List[str] = None

class ProjectRequest(BaseModel):
    user_id: int
    project_name: str
    project_model_name: str
    description: str
    accesscontrol: AccessControl
    is_private: int

# project 응답 DTO
class ProjectResponse(BaseModel):
    project_id: int
    project_name: str
    model_name: str
    description: str
    permission_id: str
    user_id: int
    is_private: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        protected_namespaces = ()

# Project list 조회 요청 DTO
class ProjectListRequest(BaseModel):
    user_id: int
    department_id: int
    select_department: Optional[str] = None
    select_model_name: Optional[str] = None
    
# Project list 응답 DTO
class ProjectListResponse(BaseModel):
    project_id: int
    project_name: str
    model_name: str
    description: str
    user_name: str
    department_name: str
    is_private: int
    create_at: datetime
    updated_at: datetime
    data_count: int

    class Config:
        from_attributes = True
        protected_namespaces = ()


# User 응답 DTO
class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str

    class Config:
        from_attributes = True

# Department 응답 DTO
class DepartmentResponse(BaseModel):
    department_id: int
    department_name: str

    class Config:
        from_attributes = True
