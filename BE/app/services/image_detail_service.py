from typing import List
from bson import ObjectId
from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from dto.common_dto import ErrorResponse
from configs.mongodb import collection_permissions, collection_metadata, collection_images, collection_tagimages
from models.mariadb_users import Projects, Users, Departments, ProjectImage
from dto.image_detail_dto import UserInformation, AccessControl, ImageDetailRequest, ImageDetailResponse, ImageDetailTagRequest, ImageDetailTagResponse, ImageDetailAuthRequest, ImageDetailAuthResponse

from fastapi import HTTPException
from sqlalchemy.orm import Session
from bson import ObjectId

class ImageDetailService:
    def __init__(self, db: Session):
        self.db = db
    
    # 1. 이미지 정보 가져오기
    async def read_image_detail(self, image_id: str) -> ImageDetailResponse:
        # 1. MongoDB에서 이미지 정보 조회
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
            user=user_list,
            department=departments
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


    # # 2. 태그 추가
    # async def add_image_tag(self, image_detail_tag_request: ImageDetailTagRequest):
        
    #     user_department = self.db.query(Users).filter(Users.user_id == image_detail_tag_request.user_id).first()
    #     if not user_department:
    #         raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    #     # 1. image id 저장
    #     image_id = image_detail_tag_request.image_id
    #     # 2. image id로 metadata id 접근
    #     image_one = await collection_images.find_one({"_id": image_id})
    #     metadata_id = image_one.get("metadataId")
    #     # 3. metadata id 로 metadata 접근
    #     metadata_one = await collection_metadata.find_one({"_id": metadata_id})
    #     # 4. metadata -> airesults -> 0 -> predictions -> 0 -> tags -> 추가하기
    #     # 4-1. 만약 태그에 있으면 가만히
    #     # 4-2. 만약 태그에 없으면 추가
    #     # 5. tagimages 접근
    #     # 6. tag에 존재하면 그 키값 -> 밸류값 추가
    #     # 7. tag에 존재하지 않으면 그 키값 생성 -> 밸류값 추가