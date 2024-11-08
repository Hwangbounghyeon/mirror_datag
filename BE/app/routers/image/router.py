from fastapi import APIRouter, HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from dto.common_dto import CommonResponse
from configs.mariadb import get_database_mariadb
from services.auth.auth_service import JWTManage
from services.image.image_service import ImageService
from services.image.image_extra_service import ImageExtraService
from services.image.download_service import DownloadService
from dto.image_detail_dto import ImageDetailAuthDeleteRequest, ImageDetailAuthAddRequest, ImageDetailTagDeleteRequest, ImageDetailTagAddRequest
from dto.search_dto import TagImageResponse, SearchRequest, ImageSearchResponse
from dto.download_dto import DownloadRequest

security_scheme = HTTPBearer()

router = APIRouter(prefix="/image", tags=["Image"])

# 1. 이미지 정보 조회
@router.get('/detail/{image_id}', description="이미지 정보 조회")
async def get_image_detail(
    image_id: str,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        image_service = ImageService(db)
        response = await image_service.read_image_detail(image_id)

        return CommonResponse(
            status=200,
            data=response
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 2. 해당 이미지에 태그 추가
@router.post('/tag/add', description="태그 추가")
async def add_image_tag(
    request: ImageDetailTagAddRequest,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        image_extra_service = ImageExtraService(db)

        response = await image_extra_service.add_image_tag(request)

        return CommonResponse(
            status=200,
            data=response
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
# 3. 해당 이미지에 태그 삭제
@router.post('/tag/remove', description="태그 삭제")
async def remove_image_tag(
    request: ImageDetailTagDeleteRequest,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        image_extra_service = ImageExtraService(db)

        response = await image_extra_service.delete_image_tag(request)

        return CommonResponse(
            status=200,
            data=response
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 4. 해당 이미지 유저 권한 추가
@router.post('/permission/add', description="유저 권한 추가")
async def add_image_permission(
    request: ImageDetailAuthAddRequest,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:    
        image_extra_service = ImageExtraService(db)

        response = await image_extra_service.add_image_auth(request)

        return CommonResponse(
            status=200,
            data=response
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 5. 해당 이미지 유저 권한 삭제
@router.post('/permission/remove', description="유저 권한 삭제")
async def remove_image_permission(
    request: ImageDetailAuthDeleteRequest,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        image_extra_service = ImageExtraService(db)

        response = await image_extra_service.delete_image_auth(request)

        return CommonResponse(
            status=200,
            data=response
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/download")
async def download(
    request: DownloadRequest, 
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        download_service = DownloadService(db)
        return await download_service.download_image(request)
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/tag/list", response_model=CommonResponse[TagImageResponse])
async def get_tags_and_images(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme), 
    db: Session = Depends(get_database_mariadb)):
    try:
        image_service = ImageService(db)
        result = await image_service.get_tag_and_image_lists()
        return CommonResponse(status=200, data=result)
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/search", response_model=CommonResponse[ImageSearchResponse])
async def search_images(
    condition_data: SearchRequest,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        jwt = JWTManage(db)
        user_id = jwt.verify_token(credentials.credentials)["user_id"]
        
        image_service = ImageService(db)
        result = await image_service.search_images_by_conditions(condition_data.conditions, user_id)
        
        return CommonResponse(
            status=200,
            data=result
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
