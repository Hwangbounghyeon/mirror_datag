from configs.mariadb import get_database_mariadb
from dto.project_dto import ProjectRequest, ShowProjectList
from services.project_service import ProjectService

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


router = APIRouter(prefix="/project", tags=["project"])

@router.post('', description="프로젝트 생성")
async def project(
    project_request: ProjectRequest,
    db : Session = Depends(get_database_mariadb)
    ):
    
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

@router.get("/list")
async def project_list(
    project_list : ShowProjectList,
    db : Session = Depends(get_database_mariadb)
):
    project_service = ProjectService(db)

    request = {
        "user_id": 1,
        "department_id": 1,
        "select_department": "department1",
        "selelct_model_name": "vgg19_bn"
    }

    project_service.get_project_list(request)

    return