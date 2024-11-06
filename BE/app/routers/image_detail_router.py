from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from configs.mariadb import get_database_mariadb
from dto.common_dto import CommonResponse
from dto.image_detail_dto import ImageDetailTagRequest, ImageDetailTagResponse, ImageDetailAuthRequest, ImageDetailAuthResponse
from services.image_detail_service import ImageDetailService

router = APIRouter(prefix="/imageDetail", tags=["imageDetail"])

# 1. 이미지 정보 조회
@router.get('/detail', description="이미지 정보 조회")
async def imageDetailRead(
    image_id: str,
    db: Session = Depends(get_database_mariadb)
):
    try:
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
# @router.post('', description="프로젝트 생성")
# async def imageDetailAdd(
#     image_detail_tag = ImageDetailTagRequest,
#     db : Session = Depends(get_database_mariadb)
#     ):
#     try:
#         image_Tag_service = ImageDetailService(db)

#         response = await image_Tag_service.add_image_tag(image_detail_tag)

#         return CommonResponse(
#             status=200,
#             data=response
#         )
#     except Exception as e:
#             return ErrorResponse(
#                     code="DB_ERROR",
#                     message="태그 추가 중 오류가 발생했습니다.",
#                     detail=str(e)
#                 )
