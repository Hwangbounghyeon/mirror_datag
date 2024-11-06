from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from configs.mariadb import get_database_mariadb
from dto.common_dto import CommonResponse
from dto.image_detail_dto import ImageDetailTaggingRequest, ImageDetailTaggingResponse, ImageDetailAuthRequest, ImageDetailAuthResponse
from services.image_detail_service import ImageDetailService

router = APIRouter(prefix="/imageDetail", tags=["imageDetail"])

# 1. 이미지 정보 조회
@router.get('/detail', description="이미지 정보 조회")
async def imageDetailRead(
    image_id: str,
    authorization: str = Header(None),
    db: Session = Depends(get_database_mariadb)
    ):
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Verify Token Failed")

        # Bearer 토큰 형식 검증 및 토큰 추출
        token_parts = authorization.split()
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Verify Token Failed")
            
        image_detail_service = ImageDetailService(db)
        response = await image_detail_service.read_image_detail(image_id)

        return CommonResponse(
            status=200,
            data=response
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 2. 해당 이미지에 태그 추가
@router.post('/tagging', description="태그 추가")
async def imageDetailTagging(
    request: ImageDetailTaggingRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_database_mariadb)
    ):
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Verify Token Failed")

        # Bearer 토큰 형식 검증 및 토큰 추출
        token_parts = authorization.split()
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Verify Token Failed")
            
        image_detail_service = ImageDetailService(db)

        response = await image_detail_service.add_image_tag(request)

        return CommonResponse(
            status=200,
            data=response
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
