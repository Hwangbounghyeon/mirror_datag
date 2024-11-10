from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from sqlalchemy.orm import Session

from configs.mariadb import get_database_mariadb
from dto.common_dto import CommonResponse
from dto.pagination_dto import PaginationDto
from dto.project_dto import ProjectRequest, ProjectResponse, UserRequet
from services.project.project_service import ProjectService
from services.auth.auth_service import JWTManage
from dto.image_detail_dto import ImageDetailAuthDeleteRequest, ImageDetailAuthAddRequest, ImageDetailTagDeleteRequest, ImageDetailTagAddRequest
from dto.search_dto import TagImageResponse, SearchRequest, ImageSearchResponse
from dto.uploads_dto import UploadRequest
from services.project.upload_service import UploadService
import json


security_scheme = HTTPBearer()

router = APIRouter(prefix="")

# 1. Project 생성
@router.post("/create", description="프로젝트 생성", response_model=CommonResponse[str])
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
@router.delete("/delete/{project_id}")
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

# 4. project 이미지 리스트 조회
@router.post("/image/{project_id}/list", response_model=CommonResponse[PaginationDto[ImageSearchResponse]])
async def search_project_images(
    project_id: str,
    search_request: SearchRequest = None,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        jwt = JWTManage(db)
        user_id = jwt.verify_token(credentials.credentials)["user_id"]
        
        project_service = ProjectService(db)
        result = await project_service.search_project_images(project_id, search_request, user_id)

        return CommonResponse(
            status=200, 
            data=result
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 5. 이미지 업로드
@router.post("/image/upload", description="이미지 업로드(zip, image)")
async def image_upload(
    upload_request: str = Form(...),
    files: list[UploadFile] = File(...),
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db : Session = Depends(get_database_mariadb)
):
    try:
        print("file : ",files)
        access_token = credentials.credentials
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]

        parsed_request = json.loads(upload_request)
        upload_request_obj = UploadRequest(**parsed_request)

        upload = UploadService(db)
        file_urls = await upload.upload_image(upload_request_obj, files, user_id)

        return CommonResponse(
            status=200,
            data=file_urls
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))