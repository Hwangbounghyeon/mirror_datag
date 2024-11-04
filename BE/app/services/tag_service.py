from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, not_, join, func, union
from typing import List
from dto.tags_dto import TagImageResponseDTO, SearchConditionDTO
from models.mariadb_image import Tags, ImageTag, Images, TagType
from configs.s3 import get_s3_image_paths
from configs.mongodb import collection_metadata

from dotenv import load_dotenv

load_dotenv()

# 필수 기능

## 1. tag 목록 불러오기
class TagService:
    def __init__(self, db: Session):
        self.db = db
        self.mongo_metadata = collection_metadata
    
    async def get_tag_and_image_lists(self) -> TagImageResponseDTO:
        try:
            
            tags_by_type = {tag_type: [] for tag_type in TagType}
            
            tag_lists = self.db.query(Tags).all()
            for tag in tag_lists:
                tags_by_type[tag.tag_type].append(tag.tag_name)
                
            paths = get_s3_image_paths()

            return TagImageResponseDTO(
                tags=tags_by_type,
                paths=paths
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"태그와 이미지 목록 조회 중 오류가 발생했습니다: {str(e)}"
            )
        

    ## 2. 이미지 Tag 필터링하기(고급 검색 기능 - AND, OR, NOT)
    # - 검색 조건 받아오기
    # - 검색 조건으로 image-tag 확인해서 해당 조건에 필터링 되는 image 확인
    # - image의 metadata_id를 통해 image의 path를 찾아서 list로 만들어서 반환

    async def search_images(self, search_dto: SearchConditionDTO) -> List[str]:
            """검색 조건에 맞는 이미지의 S3 경로 목록 반환"""
            try:
                final_query = None

                # conditions 리스트의 각 condition은 OR로 연결
                for condition in search_dto.conditions:
                    # 현재 condition에 대한 쿼리 시작
                    current_query = self.db.query(Images.image_id).distinct()

                    # 하나의 condition 내의 조건들은 AND로 연결
                    if condition.and_condition and len(condition.and_condition) > 0:
                        and_subquery = (
                            self.db.query(ImageTag.image_id)
                            .join(Tags)
                            .filter(Tags.tag_name.in_(condition.and_condition))
                            .group_by(ImageTag.image_id)
                            .having(func.count(func.distinct(Tags.tag_name)) == len(condition.and_condition))
                        )
                        current_query = current_query.filter(Images.image_id.in_(and_subquery))

                    if condition.or_condition and len(condition.or_condition) > 0:
                        or_subquery = (
                            self.db.query(ImageTag.image_id)
                            .join(Tags)
                            .filter(Tags.tag_name.in_(condition.or_condition))
                            .distinct()
                        )
                        current_query = current_query.filter(Images.image_id.in_(or_subquery))

                    if condition.not_condition and len(condition.not_condition) > 0:
                        not_subquery = (
                            self.db.query(ImageTag.image_id)
                            .join(Tags)
                            .filter(Tags.tag_name.in_(condition.not_condition))
                            .distinct()
                        )
                        current_query = current_query.filter(~Images.image_id.in_(not_subquery))

                    # 각 condition의 결과를 UNION (OR 연산)
                    if final_query is None:
                        final_query = current_query
                    else:
                        final_query = final_query.union(current_query)

                # 최종 이미지 ID 목록 조회
                image_ids = final_query.all() if final_query else []
                
                # 이미지 경로 조회
                images = self.db.query(Images).filter(
                    Images.image_id.in_([id[0] for id in image_ids])
                ).all()
                
                paths = []
                for image in images:
                    metadata = await self.mongo_metadata.find_one(
                        {"_id": image.metadata_id}
                    )
                    if metadata:
                        paths.append(metadata["fileList"])
                        
                return paths

            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"이미지 검색 중 오류 발생: {str(e)}"
                )


### 2-1(Type별로 필터링)
### 2-2(기간 선택)


# 3. 이미지 batches 가져오기(진행 상황 확인 용도)


# 4. 이미지 batches 리스트 가져오기(과거 포함 진행 상황 확인 용도)


# 5.태그 수정은 어디에서 하지?