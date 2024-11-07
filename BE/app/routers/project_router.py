from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from sqlalchemy.orm import Session

from configs.mariadb import get_database_mariadb
from dto.common_dto import CommonResponse
from dto.pagination_dto import PaginationDto
from dto.project_dto import ProjectRequest, ProjectListRequest, ProjectResponse
from services.project_service import ProjectService, ProjectSubService
from services.user_service import JWTManage

security_scheme = HTTPBearer()

router = APIRouter(prefix="/project", tags=["project"])

# 1. Project 생성
@router.post('', description="프로젝트 생성", response_model=CommonResponse[str])
async def project(
    project_request: ProjectRequest,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db : Session = Depends(get_database_mariadb)
):
    try:    
        access_token = credentials.credentials
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]
        
        project_service = ProjectService(db)

        response = await project_service.create_project(user_id, project_request)

        return CommonResponse(
            status=200,
            data=response
        )
    
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

# 2. Project 리스트 조회
@router.get("/list", response_model=CommonResponse[PaginationDto[List[ProjectResponse] | None]])
async def project_list(
    model_name: str | None = None,
    page: int = 1,
    limit: int = 10,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db : Session = Depends(get_database_mariadb)
):
    try:
        access_token = credentials.credentials
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]
        
        project_service = ProjectService(db)

        projects_list = await project_service.get_project_list(user_id, model_name, page, limit)

        return CommonResponse(
            status=200,
            data=projects_list
        )

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 3. Project 삭제
@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db : Session = Depends(get_database_mariadb)
):
    try:
        project_service = ProjectService(db)
        await project_service.delete_project(project_id)
        return CommonResponse(
            status=200,
            data={"message": "프로젝트가 성공적으로 삭제되었습니다."}
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# 4. 부서 리스트 조회
@router.get("/departments")
async def get_department_list(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        project_sub_service = ProjectSubService(db)
        departments = await project_sub_service.get_department_list()
        return CommonResponse(
            status=200,
            data=departments
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 5. 사용자 이름 검색
@router.get("/users/search")
async def search_user_name(
    name: str,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        project_sub_service = ProjectSubService(db)
        users = await project_sub_service.search_user_name(name)
        return CommonResponse(
            status=200,
            data=users
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))