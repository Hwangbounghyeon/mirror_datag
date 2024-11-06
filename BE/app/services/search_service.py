from fastapi import HTTPException
from typing import Dict
from dto.search_dto import TagImageResponseDTO, SearchConditionDTO, ImageSearchResponseDTO
from configs.mongodb import collection_tag_images, collection_metadata, collection_images
from configs.s3 import get_s3_image_paths
from bson import ObjectId

from dotenv import load_dotenv

load_dotenv()

# 필수 기능

## 1. tag 목록 불러오기
class TagService:
    def __init__(self):
        self.collection_tag_images = collection_tag_images
        self.collection_metadata = collection_metadata
        self.collection_images = collection_images
    
    async def get_tag_and_image_lists(self) -> TagImageResponseDTO:
        try:
            tag_doc = await self.collection_tag_images.find_one({})
            if not tag_doc:
                tags = []
            else:
                tags = list(tag_doc['tag'].keys()) if tag_doc else []
            
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
            return TagImageResponseDTO(
                tags=sorted(tags),
                images=images  # {이미지 _id: 이미지 경로}
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

    async def search_images_by_conditions(self, search_dto: SearchConditionDTO) -> ImageSearchResponseDTO:
        try:
            # 1. tag document 가져오기
            tag_doc = await self.collection_tag_images.find_one({})
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
            if not tag_doc:
                ImageSearchResponseDTO(images={})

            matching_metadata_ids = set()  # 최종 결과를 저장할 set
            '''
            matching_metadata_ids = set()  # 초기값: 빈 set
            '''

            # 2. 각 condition 처리 (conditions는 OR로 연결)
            for condition in search_dto.conditions:
                '''
                condition 예시:
                {
                    "and_condition": ["dog", "2024"],
                    "or_condition": ["cat"],
                    "not_condition": []
                }
                '''
                current_metadata_ids = set()  # 현재 condition의 결과
                '''
                current_metadata_ids = set()  # 초기값: 빈 set
                '''

                # 3. AND 조건 처리
                if condition.and_condition:
                    current_metadata_ids = set(tag_doc['tag'].get(condition.and_condition[0], []))
                    '''
                    current_metadata_ids = {"metadata_id1", "metadata_id2", "metadata_id3"}
                    '''
                    for tag in condition.and_condition[1:]:
                        if tag in tag_doc['tag']:
                            current_metadata_ids &= set(tag_doc['tag'][tag])
                            '''
                            tag_doc['tag']["2024"] = ["metadata_id1", "metadata_id2"]
                            current_metadata_ids = {"metadata_id1", "metadata_id2"}
                            '''
                        else:
                            ImageSearchResponseDTO(images={})
                                
                                
                # 4. OR 조건 처리
                if condition.or_condition:
                    or_metadata_ids = set()
                    '''
                    or_metadata_ids = set()  # 초기값: 빈 set
                    '''
                    for tag in condition.or_condition:  # "cat"
                        if tag in tag_doc['tag']:
                            or_metadata_ids.update(tag_doc['tag'][tag])
                            '''
                            or_metadata_ids = {"metadata_id2", "metadata_id4"}
                            '''
                    
                    if current_metadata_ids:  # AND 조건이 있었다면
                        current_metadata_ids &= or_metadata_ids
                        '''
                        current_metadata_ids = {"metadata_id2"}
                        # {"metadata_id1", "metadata_id2"} ∩ {"metadata_id2", "metadata_id4"}
                        '''
                    else:  
                        current_metadata_ids = or_metadata_ids
                        '''
                        # AND 조건이 없었을 경우
                        current_metadata_ids = {"metadata_id2", "metadata_id4"}
                        '''

                # 5. NOT 조건 처리
                if condition.not_condition:
                    not_metadata_ids = set()
                    for tag in condition.not_condition:
                        if tag in tag_doc['tag']:
                            not_metadata_ids.update(tag_doc['tag'][tag])
                            '''
                            not_metadata_ids = {"metadata_id5", "metadata_id6"}
                            '''
                    current_metadata_ids -= current_metadata_ids.difference(not_metadata_ids)
                    '''
                    현재 예시에서는 not_condition이 비어있으므로 변화 없음
                    current_metadata_ids = {"metadata_id2"}
                    '''

                # 6. 현재 condition의 결과를 전체 결과에 추가 (각 고급 연산 결과 간에는 OR 연산 수행)
                matching_metadata_ids.update(current_metadata_ids)
                '''
                matching_metadata_ids = {"metadata_id2"}
                '''

            # 7. metadata 아이디로 images 컬렉션에서 image 정보 가져오고, metadata 컬렉션에서 실제 파일 경로 찾기
            if matching_metadata_ids:
                query = {"_id": {"$in": [ObjectId(id) for id in matching_metadata_ids]}}
                image_data = {}
                '''
                query = {"_id": {"$in": [ObjectId("metadata_id2")]}
                '''
                docs = await self.collection_images.find(query).to_list(length=None)
                '''
                docs = [
                    {
                        "_id": ObjectId("image_id1"),
                        "metadataId": "metadata_id1",
                        "featureId": "feature_id1"
                    },
                    {
                        "_id": ObjectId("image_id2"),
                        "metadataId": "metadata_id2",
                        "featureId": "feature_id2"
                    }
                ]
                '''
                
                for doc in docs:
                    metadata = await self.collection_metadata.find_one(
                        {"_id": ObjectId(doc["metadataId"])}
                    )
                    '''
                    metadata = {
                        "_id": ObjectId("metadata_id1"),
                        "fileList": ["s3://bucket/path/to/image1.jpg"],
                        "metadata": {
                            "branch": "branch1",
                            "process": "process1",
                            ...
                        }
                    }
                    '''
                    
                    if metadata and "fileList" in metadata and metadata["fileList"]:
                        image_data[str(doc["_id"])] = metadata["fileList"][0]
                        '''
                        image_dict = {
                            "image_id1": "s3://bucket/path/to/image1.jpg",
                            "image_id2": "s3://bucket/path/to/image2.jpg"
                        }
                        '''
                
                return ImageSearchResponseDTO(images=image_data)

            return ImageSearchResponseDTO(images={})

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