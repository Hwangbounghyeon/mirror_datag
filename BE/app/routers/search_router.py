from fastapi import APIRouter, HTTPException, Query
from sqlalchemy.orm import Session


from services.search_service import TagService
from dto.search_dto import TagImageResponse, Condition, SearchCondition, ImageSearchResponse
from dto.common_dto import CommonResponse

router = APIRouter(
    prefix="/search",
    tags=["search"]
)

@router.get("", response_model=CommonResponse[TagImageResponse])
async def get_tags_and_images():
    """
    태그 목록과 전체 이미지 경로 반환
    """
    try:
        tag_service = TagService()
        result = await tag_service.get_tag_and_image_lists()
        return CommonResponse(status=200, data=result)
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/image", response_model=CommonResponse[ImageSearchResponse])
async def search_images_by_tags(and_tags: str | None = Query(None), or_tags: str | None = Query(None), not_tags: str | None = Query(None)):
    try:
        condition = Condition(
            and_condition=and_tags.split(",") if and_tags else [],
            or_condition=or_tags.split(",") if or_tags else [],
            not_condition=not_tags.split(",") if not_tags else []
        )
        search_dto = SearchCondition(conditions=[condition])
        tag_service = TagService()
        
        result = await tag_service.search_images_by_conditions(search_dto)
        return CommonResponse(
            status=200,
            data=result
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))