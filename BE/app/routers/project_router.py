from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from configs.mariadb import get_database_mariadb
from models.mariadb_users import Projects
from dto.project_dto import ProjectRequest, ShowProjectList, DepartmentResponse, UserResponse
from services.project_service import ProjectService, ProjectSubService




router = APIRouter(prefix="/project", tags=["project"])

# 1. Project 생성
@router.post('', description="프로젝트 생성")
async def project(
    project_request: ProjectRequest,
    db : Session = Depends(get_database_mariadb)
    ) -> Projects:
    
    project_service = ProjectService(db)
    
    request = {
    "user_id": 1,
    "project_name": "New Project",
    "model_name" : "vgg19_bn",
    "description": "This is a description of the new project.",
    "accesscontrol": {
        "view_users": ["user1", "user2", "user3"],
        "edit_users": ["user6", "user7", "user10"],
        "view_departments": ["department1", "department2"],
        "edit_departments": ["department3", "department4"]
    },
    "is_private": 0
    }
    
    response = await project_service.create_project(request)

    return response

# 2. Project 리스트 조회
@router.get("/list")
async def project_list(
    project_list : ShowProjectList,
    db : Session = Depends(get_database_mariadb)
) -> dict:
    project_service = ProjectService(db)

    request = {
        "user_id": 1,
        "department_id": 1,
        "select_department": "department1",
        "selelct_model_name": "vgg19_bn"
    }

    response = project_service.get_project_list(request)

    return response

# 3. Project 삭제
@router.delete("/{project_id}")
async def delete_project(project_id: int, db: Session = Depends(get_database_mariadb)) -> dict:
    project_service = ProjectService(db)
    result = await project_service.delete_project(project_id)
    return result

# 4. 부서 리스트 조회
@router.get("/departments")
async def get_department_list(db: Session = Depends(get_database_mariadb)) -> DepartmentResponse:
    project_sub_service = ProjectSubService(db)
    departments = await project_sub_service.get_department_list()
    return departments

# 5. 사용자 이름 검색
@router.get("/users/search")
async def search_user_name(name: str, db: Session = Depends(get_database_mariadb)) -> UserResponse:
    project_sub_service = ProjectSubService(db)
    users = await project_sub_service.search_user_name(name)
    return users