from fastapi import HTTPException
from typing import List, Set
from dto.search_dto import TagImageResponse, SearchCondition, ImageSearchResponse, SearchRequest
from configs.mongodb import (
    collection_tag_images, 
    collection_metadata, 
    collection_images,
    collection_image_permissions, 
    collection_project_images
)
from bson import ObjectId
from models.mariadb_users import Users, Departments
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

# 필수 기능

## 1. tag 목록 불러오기
class TagService:
    def __init__(self, db: Session):
        self.db = db
        self.collection_tag_images = collection_tag_images
        self.collection_metadata = collection_metadata
        self.collection_images = collection_images
        self.collection_image_permissions = collection_image_permissions
        self.collection_project_images = collection_project_images
    
    async def get_tag_and_image_lists(self) -> TagImageResponse:
        try:
            tag_doc = await self.collection_tag_images.find_one({})
            if not tag_doc:
                tags = []
            else:
                tags = list(tag_doc['tag'].keys()) if tag_doc and 'tag' in tag_doc else []
            
            images = {}
            image_docs = await self.collection_images.find({}).to_list(length=None)
            
            for doc in image_docs:
                # 메타데이터에서 파일 경로 조회
                metadata = await self.collection_metadata.find_one(
                    {"_id": ObjectId(doc["metadataId"])}
                )
                if metadata and "fileList" in metadata and metadata["fileList"]:
                    # 이미지의 _id와 경로 매칭하여 딕셔너리에 추가
                    images[str(doc["_id"])] = metadata["fileList"][0]

            # images 필드가 Dict[str, str] 형식으로 반환
            return TagImageResponse(
                tags=sorted(tags),
                images=images  # {이미지 _id: 이미지 경로}
            )
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"태그 목록과 이미지 경로 조회 중 오류가 발생했습니다: {str(e)}"
            )
    
    # 전체 이미지 유저 접근 권한 설정
    async def _get_user_permissions(self, user_id: int) -> Set[str]:
        try:
            user = self.db.query(Users).filter(Users.user_id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="사용자가 존재하지 않습니다.")
            
            department = self.db.query(Departments).filter(
                Departments.department_id == user.department_id
            ).first()
            department_name = department.department_name if department else None

            permissions = await self.collection_image_permissions.find_one({})
            if not permissions:
                return set()

            accessible_images = set()

            if 'user' in permissions and str(user_id) in permissions['user']:
                accessible_images.update(permissions['user'].get(str(user_id), []))

            if department_name and 'department' in permissions:
                accessible_images.update(permissions['department'].get(department_name, []))

            return accessible_images

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def _filter_by_permissions(self, image_ids: Set[str], user_id: int) -> Set[str]:
        accessible_images = await self._get_user_permissions(user_id)
        return image_ids & accessible_images
    
    # 2. 각 그룹별로 Tag 필터링
    async def _process_condition_group(self, tag_doc: dict, condition: SearchCondition) -> set:
        result_ids = None

        # AND 조건 처리
        if condition.and_condition:
            for tag in condition.and_condition:
                if tag in tag_doc['tag']:
                    current_ids = set(tag_doc['tag'][tag])
                    result_ids = current_ids if result_ids is None else result_ids & current_ids
                else:
                    return set()  # AND 조건 중 하나라도 매칭되지 않으면 빈 set 반환

        # OR 조건 처리
        if condition.or_condition:
            or_ids = set()
            for tag in condition.or_condition:
                if tag in tag_doc['tag']:
                    or_ids.update(tag_doc['tag'][tag])
            if result_ids is None:
                result_ids = or_ids
            else:
                result_ids &= or_ids

        # 아직 result_ids가 None이면 모든 이미지 ID로 초기화
        if result_ids is None:
            result_ids = set()
            for tag_ids in tag_doc['tag'].values():
                result_ids.update(tag_ids)

        # NOT 조건 처리
        if condition.not_condition:
            exclude_ids = set()
            for tag in condition.not_condition:
                if tag in tag_doc['tag']:
                    exclude_ids.update(tag_doc['tag'][tag])
            result_ids -= exclude_ids

        return result_ids
    
    ## 3. 이미지 Tag 필터링하기(고급 검색 기능 - AND, OR, NOT)
    async def search_images_by_conditions(self, search_dto: List[SearchCondition], user_id: int) -> ImageSearchResponse:
        try:
            # 1. tag document 가져오기
            tag_doc = await self.collection_tag_images.find_one({})
            if not tag_doc or not search_dto:
                ImageSearchResponse(images={})
            '''
            tag_doc = {
                "_id": ObjectId("67284a7df0b2373f02710c8f"),
                "tag": {
                    "dog": ["metadata_id1", "metadata_id2", "metadata_id3"],
                    "cat": ["metadata_id2", "metadata_id4"],
                    "2024-01": ["metadata_id1", "metadata_id2"]
                }
            }
            '''
            
            # 모든 조건 그룹을 처리하고 결과를 OR 연산으로 결합
            final_matching_ids = set()
            for condition in search_dto:
                group_result = await self._process_condition_group(tag_doc, condition)
                final_matching_ids.update(group_result)
            
            if not final_matching_ids:
                return ImageSearchResponse(images={})
                
            allowed_images = await self._filter_by_permissions(final_matching_ids, user_id)
            if not allowed_images:
                return ImageSearchResponse(images={})
            

            # 매칭된 이미지 정보 조회
            image_data = {}
            for image_id in final_matching_ids:
                image = await self.collection_images.find_one({"_id": ObjectId(image_id)})
                if image:
                    metadata = await self.collection_metadata.find_one(
                        {"_id": ObjectId(image["metadataId"])}
                    )
                    if metadata and "fileList" in metadata and metadata["fileList"]:
                        image_data[image_id] = metadata["fileList"][0]

            return ImageSearchResponse(images=image_data)

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"이미지를 찾는 중 에러가 발생했습니다: {str(e)}"
            )
            
    async def search_project_images(self, project_id: str, search_request: SearchRequest | None, user_id: int) -> ImageSearchResponse:
        try:
            project_images = await self.collection_project_images.find_one({})
            if not project_images or "project" not in project_images:
                return ImageSearchResponse(images={})

            project_image_ids = set(project_images["project"].get(project_id, []))
            if not project_image_ids:
                return ImageSearchResponse(images={})
            
            # 검색 조건이 있는 경우에만 필터링 적용
            if search_request and search_request.conditions:
                tag_doc = await self.collection_tag_images.find_one({})
                if tag_doc:
                    matching_ids = set()
                    for condition in search_request.conditions:
                        group_result = await self._process_condition_group(tag_doc, condition)
                        matching_ids.update(group_result)
                    project_image_ids &= matching_ids

            image_data = {}
            for image_id in project_image_ids:
                image = await self.collection_images.find_one({"_id": ObjectId(image_id)})
                if image:
                    metadata = await self.collection_metadata.find_one(
                        {"_id": ObjectId(image["metadataId"])}
                    )
                    if metadata and "fileList" in metadata and metadata["fileList"]:
                        image_data[image_id] = metadata["fileList"][0]

            return ImageSearchResponse(images=image_data)

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


### 2-1(Type별로 필터링)
### 2-2(기간 선택)


# 3. 이미지 batches 가져오기(진행 상황 확인 용도)


# 4. 이미지 batches 리스트 가져오기(과거 포함 진행 상황 확인 용도)


# 5.태그 수정은 어디에서 하지?