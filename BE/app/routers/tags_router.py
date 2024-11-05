from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from configs.mariadb import get_database_mariadb as get_db
from services.tag_service import TagService
from dto.tags_dto import TagImageResponseDTO, SearchConditionDTO
from dto.common_dto import CommonResponse, ErrorResponse

router = APIRouter(
    prefix="/search",
    tags=["search"]
)

@router.get("", response_model=CommonResponse[TagImageResponseDTO])
async def get_tags_and_images():
    """
    태그 목록과 전체 이미지 경로 반환
    """
    try:
        tag_service = TagService()
        result = await tag_service.get_tag_and_image_lists()
        return CommonResponse(status=200, data=result)
    except Exception as e:
        return CommonResponse(
            status=500, 
            data=ErrorResponse(
                code="SEARCH_ERROR",
                message="태그 목록과 이미지 경로 조회 중 오류가 발생했습니다.",
                detail=str(e)
            )
        )

@router.get("/image", response_model=CommonResponse[List[str]])
async def search_images_by_tags(search_dto: SearchConditionDTO):
    try:
        tag_service = TagService()
        result = await tag_service.search_images_by_conditions(search_dto)
        return CommonResponse(
            status=200,
            data=result
        )
    except Exception as e:
        return CommonResponse(
            status=500,
            error=ErrorResponse(
                code="SEARCH_ERROR",
                message="이미지 검색 중 오류가 발생했습니다",
                detail=str(e)
            )
        )