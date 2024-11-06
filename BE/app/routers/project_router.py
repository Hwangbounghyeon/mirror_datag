from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from configs.mariadb import get_database_mariadb
from dto.common_dto import CommonResponse, ErrorResponse
from dto.project_dto import ProjectRequest, ProjectListRequest
from services.project_service import ProjectService, ProjectSubService
from services.user_service import JWTManage



router = APIRouter(prefix="/project", tags=["project"])

# 1. Project 생성
@router.post('', description="프로젝트 생성")
async def project(
    project_request: ProjectRequest,
    authorization: str = Header(None),
    db : Session = Depends(get_database_mariadb)
    ):
    try:
        if not authorization:
            return CommonResponse[ErrorResponse](
                status=401,
                error=ErrorResponse(
                    code="FAILED_VERIFY_TOKEN",
                    message="토큰 인증에 실패하였습니다.",
                    detail="토큰 인증에 실패하였습니다."
                )
            )
            
        # Bearer 토큰 형식 검증 및 토큰 추출
        token_parts = authorization.split()
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            return CommonResponse[ErrorResponse](
                status=401,
                error=ErrorResponse(
                    code="FAILED_VERIFY_TOKEN",
                    message="토큰 인증에 실패하였습니다.",
                    detail="토큰 인증에 실패하였습니다."
                )
            )

        access_token = token_parts[1]
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]
        
        project_service = ProjectService(db)

        response = await project_service.create_project(user_id, project_request)

        return CommonResponse(
            status=200,
            data=response
        )
    
    except Exception as e:
        return ErrorResponse(
            code="DB_ERROR",
            message="프로젝트 생성 중 오류가 발생했습니다.",
            detail=str(e)
        )
    

# 2. Project 리스트 조회
@router.get("/list")
async def project_list(
    department_name: str | None = None,
    model_name: str | None = None,
    page: int = 0,
    limit: int = 10,
    authorization: str = Header(None),
    db : Session = Depends(get_database_mariadb)
    ):
    try:
        if not authorization:
            return CommonResponse[ErrorResponse](
                status=401,
                error=ErrorResponse(
                    code="FAILED_VERIFY_TOKEN",
                    message="토큰 인증에 실패하였습니다.",
                    detail="토큰 인증에 실패하였습니다."
                )
            )
            
        # Bearer 토큰 형식 검증 및 토큰 추출
        token_parts = authorization.split()
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            return CommonResponse[ErrorResponse](
                status=401,
                error=ErrorResponse(
                    code="FAILED_VERIFY_TOKEN",
                    message="토큰 인증에 실패하였습니다.",
                    detail="토큰 인증에 실패하였습니다."
                )
            )

        access_token = token_parts[1]
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]
        
        project_service = ProjectService(db)

        projects_list = await project_service.get_project_list(user_id, department_name, model_name, page, limit)

        return CommonResponse(
                status=200,
                data=projects_list
            )

    except Exception as e:
        return ErrorResponse(
            code="DB_ERROR",
            message="프로젝트 리스트 조회 중 오류가 발생했습니다.",
            detail=str(e)
        )

# 3. Project 삭제
@router.delete("/{project_id}")
async def delete_project(project_id: str, db : Session = Depends(get_database_mariadb)):
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
        return ErrorResponse(
            code="Project Error",
            message="프로젝트를 삭제하지 못하였습니다.",
            detail=str(e)
        )


# 4. 부서 리스트 조회
@router.get("/departments")
async def get_department_list(db: Session = Depends(get_database_mariadb)):
    try:
        project_sub_service = ProjectSubService(db)
        departments = await project_sub_service.get_department_list()
        return CommonResponse(
            status=200,
            data=departments
        )
    except Exception as e:
        return ErrorResponse(
            code="DB_ERROR",
            message="부서 리스트 조회 중 오류가 발생했습니다.",
            detail=str(e)
        )

# 5. 사용자 이름 검색
@router.get("/users/search")
async def search_user_name(name: str, db: Session = Depends(get_database_mariadb)):
    try:
        project_sub_service = ProjectSubService(db)
        users = await project_sub_service.search_user_name(name)
        return CommonResponse(
            status=200,
            data=users
        )
    except Exception as e:
        return ErrorResponse(
            code="DB_ERROR",
            message="사용자 이름 검색 중 오류가 발생했습니다.",
            detail=str(e)
        )