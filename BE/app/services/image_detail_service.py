from typing import List
from bson import ObjectId
from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from configs.mongodb import collection_metadata, collection_images, collection_tag_images
from models.mariadb_users import Users, Departments
from dto.image_detail_dto import UserInformation, AccessControl, ImageDetailResponse, ImageDetailTaggingRequest, ImageDetailTaggingResponse, ImageDetailTagDeleteRequest, ImageDetailTagDeleteResponse

from fastapi import HTTPException
from sqlalchemy.orm import Session
from bson import ObjectId

class ImageDetailService:
    def __init__(self, db: Session):
        self.db = db
    
    # 1. 이미지 정보 가져오기
    async def read_image_detail(self, image_id: str) -> ImageDetailResponse:
        # 1. MongoDB에서 이미지 정보 조회
        print(image_id)
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        
        image_one["_id"] = str(image_one["_id"])
        metadata_id = image_one.get("metadataId")

        # 2. MongoDB에서 메타데이터 조회
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")

        metadata_one["_id"] = str(metadata_one["_id"])

        # 3. Access Control 정보 가져오기
        access_control_one = metadata_one.get("metadata").get("accessControl")
        users = access_control_one.get("users")
        
        # departments 값이 None, 빈 문자열, 혹은 비어있는 경우 빈 리스트로 기본값 설정
        departments = access_control_one.get("departments")
        if not isinstance(departments, list) or any(department == '' for department in departments):
            departments = []

        # 4. Users 정보 조회 및 가공
        user_list = []
        for user in users:
            user_one = self.db.query(Users).filter(Users.user_id.like(f"%{user}%")).first()
            if user_one is None:
                continue  # 일치하는 사용자가 없으면 건너뜁니다.

            department_id = user_one.department_id
            department_one = self.db.query(Departments).filter(Departments.department_id == department_id).first()
            department_name = department_one.department_name if department_one else "Unknown Department"

            user_information = UserInformation(
                uid=user_one.user_id,
                name=user_one.name,
                department_name=department_name
            )
            user_list.append(user_information)
        
        # 5. AccessControl 객체 생성
        access_control = AccessControl(
            users=user_list,
            departments=departments
        )

        # 6. 결과 반환
        try:
            return {
                "metadata": metadata_one,
                "access_control": access_control
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"이미지 정보 조회 중 오류가 발생했습니다: {str(e)}"
            )
        
    # 2. 태그 추가
    async def add_image_tag(self, request: ImageDetailTaggingRequest) -> ImageDetailTaggingResponse:
        # 1. image id 저장
        image_id = request.image_id
        # 2. MongoDB에서 이미지 정보 조회
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        
        image_one["_id"] = str(image_one["_id"])

        # 3. MongoDB에서 메타데이터 조회
        metadata_id = image_one.get("metadataId")
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")

        metadata_one["_id"] = str(metadata_one["_id"])
        
        await collection_metadata.update_one(
            {"_id": ObjectId(metadata_id)},
            {
                "$addToSet": {
                    "aiResults.0.predictions.0.tags": {"$each": request.tag_list}  # tags 배열에 새로운 값만 추가
                }
            }
        )
        for tag in request.tag_list:
            await collection_tag_images.update_one(
                {},
                {
                    "$addToSet": {
                        f"tag.{tag}": request.image_id  # tags 배열에 새로운 값만 추가
                    }
                }
            )
        
        tags = metadata_one.get("aiResults", [{}])[0].get("predictions", [{}])[0].get("tags", [])
        # 4. 응답 반환
        try:
            return {
                "image_id": image_id,
                "tag_name_list": tags
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"이미지 정보 조회 중 오류가 발생했습니다: {str(e)}"
            )
        
    # 3. 태그 삭제
    async def delete_image_tag(self, request: ImageDetailTagDeleteRequest) -> ImageDetailTagDeleteResponse:
        # 1. image_id, image_one
        image_id = request.image_id
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        
        image_one["_id"] = str(image_one["_id"])

        # 2. metadata_id, metadata_one
        metadata_id = image_one.get("metadataId")
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")

        metadata_one["_id"] = str(metadata_one["_id"])

        # 3. metadata에서 태그 삭제
        await collection_metadata.update_one(
            {"_id": ObjectId(metadata_id)},
            {
                "$pull": {
                    "aiResults.0.predictions.0.tags": {"$in": request.delete_tag_list}
                }
            }
        )

        # 4. tagImages에서 image_id를 해당 태그들에서 삭제
        for tag in request.delete_tag_list:
            await collection_tag_images.update_one(
                {"_id": ObjectId("6729792cae005e3836525caf")},
                {
                    "$pull": {
                        f"tag.{tag}": image_id  # 각 태그 목록에서 image_id 삭제
                    }
                }
            )

        # 업데이트된 tag 데이터 다시 가져오기
        tag_datas = await collection_tag_images.find_one({"_id": ObjectId("6729792cae005e3836525caf")})
        
        # 빈 배열이 된 태그 필드 삭제
        for tag, images in tag_datas.get("tag", {}).items():
            if not images:  # 빈 배열인 경우
                await collection_tag_images.update_one(
                    {"_id": ObjectId("6729792cae005e3836525caf")},
                    {"$unset": {f"tag.{tag}": ""}}  # 빈 배열이 되면 필드 삭제
                )
        
        # 삭제 후 남아있는 tags 확인
        tags = metadata_one.get("aiResults", [{}])[0].get("predictions", [{}])[0].get("tags", [])
        
        # 5. 응답 반환
        try:
            return {
                "image_id": image_id,
                "tag_name_list": tags
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"이미지 정보 조회 중 오류가 발생했습니다: {str(e)}"
            )
