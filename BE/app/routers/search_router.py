from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict

from services.search_service import TagService
from dto.search_dto import TagImageResponseDTO, ConditionDTO, SearchConditionDTO, ImageSearchResponseDTO
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

@router.get("/image", response_model=CommonResponse[ImageSearchResponseDTO])
async def search_images_by_tags(and_tags: str | None = Query(None), or_tags: str | None = Query(None), not_tags: str | None = Query(None)):
    try:
        condition = ConditionDTO(
            and_condition=and_tags.split(",") if and_tags else [],
            or_condition=or_tags.split(",") if or_tags else [],
            not_condition=not_tags.split(",") if not_tags else []
        )
        search_dto = SearchConditionDTO(conditions=[condition])
        tag_service = TagService()
        
        result = await tag_service.search_images_by_conditions(search_dto)
        return CommonResponse(
            status=200,
            data=result
        )
    except ValueError as e:
        return CommonResponse(
            status=400,
            error=ErrorResponse(
                code="VALIDATION_ERROR",
                message="검색 조건이 유효하지 않습니다",
                detail=str(e)
            )
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