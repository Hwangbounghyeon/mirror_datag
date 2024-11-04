from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from configs.mariadb import get_database_mariadb as get_db
from services.tag_service import TagService
from dto.tags_dto import TagImageResponseDTO, SearchConditionDTO

router = APIRouter(
    prefix="/search",
    tags=["search"]
)

@router.get("/", response_model=TagImageResponseDTO)
async def get_tags_and_images(db: Session = Depends(get_db)):
    """
    TagType별 태그 목록과 전체 이미지 경로 반환
    """
    tag_service = TagService(db)
    return await tag_service.get_tag_and_image_lists()

@router.post("/image", response_model=List[str])
async def search_images_by_tags(search_dto: SearchConditionDTO, db: Session = Depends(get_db)):
    tag_service = TagService(db)
    return await tag_service.search_images(search_dto)