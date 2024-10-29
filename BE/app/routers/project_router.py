from configs.mariadb import get_database_mariadb
from dto.project_dto import ProjectRequest
from services.project_service import ProjectService

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


router = APIRouter(prefix="/project", tags=["project"])

@router.post('/', description="프로젝트 생성")
async def project(
    project_request: ProjectRequest,
    db : Session = Depends(get_database_mariadb)
    ):
    
    project_service = ProjectService(db)
    
    request = {
    "user_id": 1,
    "name": "New Project",
    "description": "This is a description of the new project.",
    "accesscontrol": {
        "users": ["user1", "user2", "user3"],
        "departments": ["department1", "department2"]
    },
    "is_private": 0
    }
    
    response = await project_service.create_project(request)

    return response