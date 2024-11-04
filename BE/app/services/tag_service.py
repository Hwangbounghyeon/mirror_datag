from fastapi import HTTPException
from typing import List, Set
from dto.tags_dto import TagImageResponseDTO, SearchConditionDTO
from configs.mongodb import collection_tagimages, collection_metadata, collection_images
from configs.s3 import get_s3_image_paths
from bson import ObjectId

from dotenv import load_dotenv

load_dotenv()

# 필수 기능

## 1. tag 목록 불러오기
class TagService:
    def __init__(self):
        self.collection_tagimages = collection_tagimages
        self.collection_metadata = collection_metadata
        self.collection_images = collection_images
    
    async def get_tag_and_image_lists(self) -> TagImageResponseDTO:
        try:

            tag_doc = await self.collection_tagimages.find_one({})
            if not tag_doc:
                tags = []
            else:
                tags = list(tag_doc['tag'].keys())
                
            paths = get_s3_image_paths()

            return TagImageResponseDTO(
                tags=sorted(tags),
                paths=paths
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"태그 목록과 이미지 경로 조회 중 오류가 발생했습니다: {str(e)}"
            )
        

    ## 2. 이미지 Tag 필터링하기(고급 검색 기능 - AND, OR, NOT)
    # - 검색 조건 받아오기
    # - 검색 조건으로 image-tag 확인해서 해당 조건에 필터링 되는 image 확인
    # - image의 metadata_id를 통해 image의 path를 찾아서 list로 만들어서 반환

    async def search_images_by_conditions(self, search_dto: SearchConditionDTO):
        try:
            # 1. tag document 가져오기
            tag_doc = await self.collection_tagimages.find_one({})
            if not tag_doc:
                return []

            matching_metadata_ids = set()  # 최종 결과를 저장할 set

            # 2. 각 condition 처리 (conditions는 OR로 연결)
            for condition in search_dto.conditions:
                current_metadata_ids = set()  # 현재 condition의 결과
                # 3. AND 조건 처리
                if condition.and_condition:
                    # 첫 번째 태그의 metadata_ids 가져오기
                    first_tag = condition.and_condition[0]
                    if first_tag in tag_doc['tag']:
                        # tag_doc['tag'][first_tag]는 해당 태그를 가진 모든 metadata_id 배열
                        current_metadata_ids = set(tag_doc['tag'][first_tag])
                    
                    if len(condition.and_condition) > 1:
                        # 나머지 태그들과 교집합 구하기
                        for tag in condition.and_condition[1:]:
                            if tag in tag_doc['tag']:
                                # intersection(): 두 set의 교집합 반환
                                # 예: {1,2,3}.intersection({2,3,4}) => {2,3}
                                current_metadata_ids = current_metadata_ids.intersection(
                                    tag_doc['tag'][tag]
                                )
                                
                # 4. OR 조건 처리
                if condition.or_condition:
                    or_metadata_ids = set()
                    for tag in condition.or_condition:
                        if tag in tag_doc['tag']:
                            # update(): set에 여러 요소 추가 (합집합)
                            or_metadata_ids.update(tag_doc['tag'][tag])
                    
                    if current_metadata_ids:  # AND 조건이 있었다면
                        # AND 조건과 OR 조건의 교집합
                        current_metadata_ids = current_metadata_ids.intersection(
                            or_metadata_ids
                        )
                    else:  # AND 조건이 없었다면
                        current_metadata_ids = or_metadata_ids

                # 5. NOT 조건 처리
                if condition.not_condition:
                    not_metadata_ids = set()
                    for tag in condition.not_condition:
                        if tag in tag_doc['tag']:
                            not_metadata_ids.update(tag_doc['tag'][tag])
                    # difference(): 차집합 (A - B = A에는 있고 B에는 없는 요소들)
                    current_metadata_ids = current_metadata_ids - not_metadata_ids

                # 6. 현재 condition의 결과를 전체 결과에 추가 (OR 연산)
                matching_metadata_ids.update(current_metadata_ids)

            # 7. metadata 컬렉션에서 실제 파일 경로 찾기
            if matching_metadata_ids:
                # $in: MongoDB의 배열 포함 연산자
                query = {"_id": {"$in": [ObjectId(id) for id in matching_metadata_ids]}}
                s3_paths = []
                docs = await self.collection_images.find(
                    query
                ).to_list(length=None)
                
                for doc in docs: 
                    metadata = await self.collection_metadata.find(
                        {"_id": ObjectId(doc["metadataId"])}
                    ).to_list(length=None)
                    
                    if "fileList" in metadata[0]:
                        s3_paths.extend(metadata[0]["fileList"])
            
                return s3_paths

            return []
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"이미지를 찾는 중 에러가 발생했습니다: {str(e)}"
            )


### 2-1(Type별로 필터링)
### 2-2(기간 선택)


# 3. 이미지 batches 가져오기(진행 상황 확인 용도)


# 4. 이미지 batches 리스트 가져오기(과거 포함 진행 상황 확인 용도)


# 5.태그 수정은 어디에서 하지?