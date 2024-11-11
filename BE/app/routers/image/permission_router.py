from fastapi import APIRouter, HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List

from dto.common_dto import CommonResponse
from configs.mariadb import get_database_mariadb
from services.image.image_extra_service import ImageExtraService
from dto.image_detail_dto import ImageDetailAuthDeleteRequest, ImageDetailAuthAddRequest

security_scheme = HTTPBearer()

router = APIRouter(prefix="/image/permission", tags=["Image"])

# 1. 해당 이미지 유저 권한 추가
@router.post('/add', description="유저 권한 추가")
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
    
# 2. 해당 이미지 유저 권한 삭제
@router.post('/remove', description="유저 권한 삭제")
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