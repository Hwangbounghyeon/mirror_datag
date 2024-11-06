from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from configs.mariadb import get_database_mariadb
from dto.common_dto import CommonResponse, ErrorResponse
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
            
        image_detail_service = ImageDetailService(db)
        response = await image_detail_service.read_image_detail(image_id)

        return CommonResponse(
            status=200,
            data=response
        )
    except Exception as e:
        return ErrorResponse(
            code="DB_ERROR", 
            message="이미지 정보 조회 중 오류가 발생했습니다.",
            detail=str(e)
        )

# 2. 해당 이미지에 태그 추가
@router.post('/tagging', description="태그 추가")
async def imageDetailTagging(
    request: ImageDetailTaggingRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_database_mariadb)
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
            
        image_detail_service = ImageDetailService(db)

        response = await image_detail_service.add_image_tag(request)

        return CommonResponse(
            status=200,
            data=response
        )
    except Exception as e:
        return ErrorResponse(
            code="DB_ERROR",
            message="태그 추가 중 오류가 발생했습니다.",
            detail=str(e)
        )
