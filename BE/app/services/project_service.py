from dto.project_dto import ProjectRequest
from configs.mongodb import collection_permissions

from sqlalchemy.orm import Session
from datetime import datetime, timezone
from bson import ObjectId

from fastapi import HTTPException
from sqlalchemy.orm import Session

from dto.project_dto import ProjectRequest, ProjectResponse, ProjectListRequest, DepartmentResponse, UserResponse, ProjectListResponse
from dto.common_dto import ErrorResponse
from configs.mongodb import collection_permissions
from models.mariadb_users import Projects, Users, Departments, ProjectImage
from typing import List

# 1. 프로젝트 생성, 삭제 및 불러오기
class ProjectService:
    def __init__(self, db: Session):
        self.db = db
    
    # 1-1. Project 생성
    async def create_project(self, request: ProjectRequest) -> Projects:
        # MongoDB permission 저장
        permission_request = {
            "users": {
                "view": request.accesscontrol.view_users,
                "edit": request.accesscontrol.edit_users
            },
            "department": {
                "view": request.accesscontrol.view_departments,
                "edit": request.accesscontrol.edit_departments
            }
        }
        
        permission = await collection_permissions.insert_one(permission_request)
        
        # MariaDB project 저장
        project = Projects(
            project_name=request.project_name,
            model_name=request.project_model_name,
            description=request.description,
            user_id=request.user_id,
            is_private=request.is_private,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        
        return ProjectResponse.model_validate(project).model_dump()
    
    # 1-2. 프로젝트 리스트 불러오기
    async def get_project_list(self, request: ProjectListRequest) -> list:
        user_department = self.db.query(Departments).filter(Departments.department_id == request.department_id).first()
        user_department_name = user_department.department_name if user_department else None

        # MongoDB에서 접근 가능한 permissions 찾기
        query = {
            "$or": [
                {"users.view": {"$in": [str(request.user_id)]}},
            {"users.edit": {"$in": [str(request.user_id)]}},
            {"department.view": {"$in": [user_department_name]}},
            {"department.edit": {"$in": [user_department_name]}}
            ]
        }
    
        permissions_cursor = collection_permissions.find(query)
        permissions_cursor_list = await permissions_cursor.to_list()
        permissions = [str(permission["_id"]) for permission in permissions_cursor_list]

        # MariaDB에서 해당 permissions에 맞는 프로젝트 조회
        projects = self.db.query(Projects).filter(Projects.permission_id.in_(permissions)).all()

        project_list = []

        if request.select_department or request.select_model_name:
            # select_department로 필터링
            if request.select_department:
                
                    for project in projects:
                        if self.db.query(Users).filter(Users.user_id == project.user_id).first().department == request.select_department:
                            project_list.append(project)

            # select_model_name으로 필터링
            if request.select_model_name:
                for project in projects:
                    if project.model_name == request.select_model_name:
                        project_list.append(project)
        else:
            project_list = projects

        project_list_response = []

        # user_name, data_count 수정 필요
        for project in project_list:
            user = self.db.query(Users).filter(Users.user_id == project.user_id).first()
            project_image_count = self.db.query(ProjectImage).filter(ProjectImage.project_id == project.project_id).count()
            project_response = ProjectListResponse(
                project_id=project.project_id,
                project_name=project.project_name,
                model_name=project.model_name,
                description=project.description,
                user_name=user.name if user else "Unknown",
                department_name=user_department_name,
                is_private=project.is_private,
                create_at=project.created_at,
                updated_at=project.updated_at,
                data_count=project_image_count
            )
            project_list_response.append(project_response)

        return project_list_response
    
    # 1-3. 프로젝트 삭제
    async def delete_project(self, project_id: int) -> str:
            # MariaDB에서 project 조회 및 삭제
            project = self.db.query(Projects).filter(Projects.project_id == project_id).first()
            if not project:
                raise HTTPException(
                    status_code=404,
                    detail=ErrorResponse(
                        code="PROJECT_NOT_FOUND",
                        message="해당 프로젝트를 찾을 수 없습니다."
                    )
                )

            # MongoDB에서 관련 permission 삭제
            permission_id = project.permission_id
            result = await collection_permissions.delete_one({"_id": ObjectId(permission_id)})
            
            if result.deleted_count == 0:
                raise HTTPException(
                    status_code=404,
                    detail=ErrorResponse(
                        code="PERMISSION_NOT_FOUND",
                        message="MongoDB에서 해당 권한을 찾을 수 없습니다."
                    )
                )

            # MariaDB에서 project 삭제
            self.db.delete(project)
            self.db.commit()


# 2. 이름 검색 및 부서 불러오기
class ProjectSubService:
    def __init__(self, db: Session):
        self.db = db
    
    # 2-1. 부서 리스트 불러오기
    async def get_department_list(self):
            departments = self.db.query(Departments).all()
            return [DepartmentResponse.model_validate(dept).model_dump() for dept in departments]
    
    # 2-2. 이름 검색
    async def search_user_name(self, name: str):
        users = self.db.query(Users).filter(Users.name.like(f"%{name}%")).all()
        user_list = []
        for user in users:
            user_one = UserResponse(
                user_id = user.user_id,
                name = user.name,
                email = user.email
            )
            user_list.append(user_one)

        return user_list
        
        
