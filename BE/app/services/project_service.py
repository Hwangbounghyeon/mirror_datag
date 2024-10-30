from datetime import datetime, timezone
from bson import ObjectId

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from dto.project_dto import ProjectRequest, ShowProjectList
from configs.mongodb import collection_permissions
from models.mariadb_users import Projects, Users, Departments
from typing import List

from dto.response_dto import CommonResponse, ErrorResponse

# 1. 프로젝트 생성, 삭제 및 불러오기
class ProjectService:
    def __init__(self, db: Session):
        self.db = db
    
    # 1-1. Project 생성
    async def create_project(self, request: ProjectRequest) -> CommonResponse:
        try:
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
                model_name=request.model_name,
                description=request.description,
                permission_id=str(permission.inserted_id),
                user_id=request.user_id,
                is_private=request.is_private,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            
            self.db.add(project)
            self.db.commit()
            self.db.refresh(project)
            
            return CommonResponse(
                status=200,
                data=project
            )

        except Exception as e:
            return CommonResponse(
                status=500,
                error=ErrorResponse(
                    code="DB_ERROR",
                    message="프로젝트 생성 중 오류가 발생했습니다.",
                    detail=str(e)
                )
            )
    
    # 1-2. 프로젝트 리스트 불러오기
    async def get_project_list(self, request: ShowProjectList) -> CommonResponse:
        try:
            # MongoDB에서 접근 가능한 permissions 찾기
            query = {
                "$or": [
                    {"users.view": request.user_id},
                    {"users.edit": request.user_id},
                    {"department.view": request.department_id},
                    {"department.edit": request.department_id}
                ]
            }
        
            permissions_cursor = collection_permissions.find(query)
            permissions = [str(permission["_id"]) for permission in permissions_cursor]
        
            # MariaDB에서 해당 permissions에 맞는 프로젝트 조회
            projects = self.db.query(Projects).filter(Projects.permission_id.in_(permissions)).all()

            # select_department로 필터링
            if request.select_department:
                projects = [
                    project for project in projects
                    if self.db.query(Users).filter(Users.user_id == project.user_id).first().department == request.select_department
                ]

            # select_model_name으로 필터링
            if request.select_model_name:
                projects = [project for project in projects if project.model_name == request.select_model_name]

            return CommonResponse(
                status=200,
                data=projects
            )
        
        except Exception as e:
            return CommonResponse(
                status=500,
                error=ErrorResponse(
                    code="DB_ERROR",
                    message="프로젝트 리스트 조회 중 오류가 발생했습니다.",
                    detail=str(e)
                )
            )
    
    # 1-3. 프로젝트 삭제
    async def delete_project(self, project_id: int) -> CommonResponse:
        try:
            # MariaDB에서 project 조회 및 삭제
            project = self.db.query(Projects).filter(Projects.project_id == project_id).first()
            if not project:
                return CommonResponse(
                    status=404,
                    error=ErrorResponse(
                        code="PROJECT_NOT_FOUND",
                        message="해당 프로젝트를 찾을 수 없습니다."
                    )
                )

            # MongoDB에서 관련 permission 삭제
            permission_id = project.permission_id
            result = await collection_permissions.delete_one({"_id": ObjectId(permission_id)})
            
            if result.deleted_count == 0:
                return CommonResponse(
                    status=404,
                    error=ErrorResponse(
                        code="PERMISSION_NOT_FOUND",
                        message="MongoDB에서 해당 권한을 찾을 수 없습니다."
                    )
                )

            # MariaDB에서 project 삭제
            self.db.delete(project)
            self.db.commit()

            return CommonResponse(
                status=200,
                data={"message": "Project deleted successfully"}
            )

        except Exception as e:
            return CommonResponse(
                status=500,
                error=ErrorResponse(
                    code="DELETE_ERROR",
                    message="프로젝트 삭제 중 오류가 발생했습니다.",
                    detail=str(e)
                )
            )


# 2. 이름 검색 및 부서 불러오기
class ProjectSubService:
    def __init__(self, db: Session):
        self.db = db
    
    # 2-1. 부서 리스트 불러오기
    async def get_department_list(self) -> CommonResponse:
        try:
            departments = self.db.query(Departments).all()
            return CommonResponse(
                status=200,
                data=departments
            )
        except Exception as e:
            return CommonResponse(
                status=500,
                error=ErrorResponse(
                    code="DB_ERROR",
                    message="부서 리스트 조회 중 오류가 발생했습니다.",
                    detail=str(e)
                )
            )
    
    # 2-2. 이름 검색
    async def search_user_name(self, name: str) -> CommonResponse:
        try:
            users = self.db.query(Users).filter(Users.nickname.like(f"%{name}%")).all()
            return CommonResponse(
                status=200,
                data=users
            )
        except Exception as e:
            return CommonResponse(
                status=500,
                error=ErrorResponse(
                    code="DB_ERROR",
                    message="사용자 이름 검색 중 오류가 발생했습니다.",
                    detail=str(e)
                )
            )
