from typing import List
from bson import ObjectId
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.mariadb_users import Users, Departments
from dto.image_detail_dto import ImageDetailAuthDeleteRequest, ImageDetailAuthDeleteResponse, AuthDetail, ImageDetailAuthAddRequest, ImageDetailAuthAddResponse, UserInformation, AccessControl, ImageDetailResponse, ImageDetailTagAddRequest, ImageDetailTagAddResponse, ImageDetailTagDeleteRequest, ImageDetailTagDeleteResponse
from configs.mongodb import collection_metadata, collection_images, collection_tag_images, collection_image_permissions

class ImageExtraService:
    def __init__(self, db: Session):
        self.db = db
    
    # 2. 태그 추가
    async def add_image_tag(self, request: ImageDetailTagAddRequest) -> ImageDetailTagAddResponse:

        ### images, matadata
        image_id = request.image_id
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        image_one["_id"] = str(image_one["_id"])

        metadata_id = image_one.get("metadataId")
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")
        metadata_one["_id"] = str(metadata_one["_id"])
        ###

        # metadata -> tags
        await collection_metadata.update_one(
            {"_id": ObjectId(metadata_id)},
            {
                "$addToSet": {
                    "aiResults.0.predictions.0.tags": {"$each": request.tag_list}
                }
            }
        )

        # tagImages
        for tag in request.tag_list:
            await collection_tag_images.update_one(
                {},
                {
                    "$addToSet": {
                        f"tag.{tag}": request.image_id
                    }
                }
            )

        ### images, matadata
        image_id = request.image_id
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        image_one["_id"] = str(image_one["_id"])

        metadata_id = image_one.get("metadataId")
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")
        metadata_one["_id"] = str(metadata_one["_id"])
        ###

        tag_name_list = metadata_one.get("aiResults", [{}])[0].get("predictions", [{}])[0].get("tags", [])
        # 4. 응답 반환
        try:
            return {
                "image_id": image_id,
                "tag_name_list": tag_name_list
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"이미지 정보 조회 중 오류가 발생했습니다: {str(e)}"
            )
        
    # 3. 태그 삭제
    async def delete_image_tag(self, request: ImageDetailTagDeleteRequest) -> ImageDetailTagDeleteResponse:
        
        ### images, matadata
        image_id = request.image_id
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        image_one["_id"] = str(image_one["_id"])

        metadata_id = image_one.get("metadataId")
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")
        metadata_one["_id"] = str(metadata_one["_id"])
        ###

        # metadata -> tags
        await collection_metadata.update_one(
            {"_id": ObjectId(metadata_id)},
            {
                "$pull": {
                    "aiResults.0.predictions.0.tags": {"$in": request.delete_tag_list}
                }
            }
        )

        # tagImages
        for tag in request.delete_tag_list:
            await collection_tag_images.update_one(
                {},
                {
                    "$pull": {
                        f"tag.{tag}": image_id
                    }
                }
            )

        # tagImages -> tagDatas
        tag_datas = await collection_tag_images.find_one()
        
        # 빈 배열이 된 태그 필드 삭제
        for tag, images in tag_datas.get("tag", {}).items():
            if not images:  # 빈 배열인 경우
                await collection_tag_images.update_one(
                    {},
                    {"$unset": {f"tag.{tag}": ""}}
                )

        ### images, matadata
        image_id = request.image_id
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        image_one["_id"] = str(image_one["_id"])

        metadata_id = image_one.get("metadataId")
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")
        metadata_one["_id"] = str(metadata_one["_id"])

        tags = metadata_one.get("aiResults", [{}])[0].get("predictions", [{}])[0].get("tags", [])
        ###

        # result
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
    
    # 4. 권한 추가
    async def add_image_auth(self, request: ImageDetailAuthAddRequest) -> ImageDetailAuthAddResponse:
        
        ### images, matadata
        image_id = request.image_id
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        image_one["_id"] = str(image_one["_id"])

        metadata_id = image_one.get("metadataId")
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")
        metadata_one["_id"] = str(metadata_one["_id"])
        ###

        # metadata -> users
        await collection_metadata.update_one(
            {"_id": ObjectId(metadata_id)},
            {
                "$addToSet": {
                    "metadata.accessControl.users": {"$each": request.user_id_list}
                }
            }
        )

        # imagePermissions -> user
        for user_id in request.user_id_list:
            await collection_image_permissions.update_one(
                {},
                {
                    "$addToSet": {
                        f"user.{user_id}": request.image_id
                    }
                }
            )
        
        ### images, matadata
        image_id = request.image_id
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        image_one["_id"] = str(image_one["_id"])

        metadata_id = image_one.get("metadataId")
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")
        metadata_one["_id"] = str(metadata_one["_id"])
        ###

        access_control_one = metadata_one.get("metadata").get("accessControl")
        users = access_control_one.get("users")
        
        # departments 값이 None, 빈 문자열, 혹은 비어있는 경우 빈 리스트로 기본값 설정
        departments = access_control_one.get("departments")
        if not isinstance(departments, list) or any(department == '' for department in departments):
            departments = []

        # users
        auth_list = []
        for user in users:
            user_one = self.db.query(Users).filter(Users.user_id.like(f"%{user}%")).first()
            if user_one is None:
                continue  # 일치하는 사용자가 없으면 건너뜁니다.
            department_id = user_one.department_id
            department_one = self.db.query(Departments).filter(Departments.department_id == department_id).first()
            department_name = department_one.department_name if department_one else "Unknown Department"
            user_information = AuthDetail(
                user_id=user_one.user_id,
                user_name=user_one.name,
                department_name=department_name
            )
            auth_list.append(user_information)

        # 5. 응답 반환
        try:
            return {
                "image_id": image_id,
                "auth_list": auth_list
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"이미지 정보 조회 중 오류가 발생했습니다: {str(e)}"
            )

    # 5. 권한 삭제
    async def delete_image_auth(self, request: ImageDetailAuthDeleteRequest) -> ImageDetailAuthDeleteResponse:
        
        ### images, matadata
        image_id = request.image_id
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        image_one["_id"] = str(image_one["_id"])

        metadata_id = image_one.get("metadataId")
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")
        metadata_one["_id"] = str(metadata_one["_id"])
        ###
        
        # 3. metadata에서 권한 삭제
        await collection_metadata.update_one(
            {"_id": ObjectId(metadata_id)},
            {
                "$pull": {
                    "metadata.accessControl.users": {"$in": request.user_id_list}
                }
            }
        )
        
        # 4. imagePermissions 에서 권한 삭제
        for user_id in request.user_id_list:
            await collection_image_permissions.update_one(
                {},
                {
                    "$pull": {
                        f"user.{user_id}": request.image_id
                    }
                }
            )
        
        # 업데이트된 user 데이터 다시 가져오기
        permission_datas = await collection_image_permissions.find_one()
        
        # 빈 배열이 된 태그 필드 삭제
        for user_id, images in permission_datas.get("user", {}).items():
            if not images:  # 빈 배열인 경우
                await collection_image_permissions.update_one(
                    {},
                    {"$unset": {f"user.{user_id}": ""}}
                )
        
        ### images, matadata
        image_id = request.image_id
        image_one = await collection_images.find_one({"_id": ObjectId(image_id)})
        if image_one is None:
            raise HTTPException(status_code=404, detail="Image not found")
        image_one["_id"] = str(image_one["_id"])

        metadata_id = image_one.get("metadataId")
        metadata_one = await collection_metadata.find_one({"_id": ObjectId(metadata_id)})
        if metadata_one is None:
            raise HTTPException(status_code=404, detail="Metadata not found")
        metadata_one["_id"] = str(metadata_one["_id"])
        ###
        
        # 3. Access Control 정보 가져오기
        access_control_one = metadata_one.get("metadata").get("accessControl")
        users = access_control_one.get("users")
        
        # departments 값이 None, 빈 문자열, 혹은 비어있는 경우 빈 리스트로 기본값 설정
        departments = access_control_one.get("departments")
        if not isinstance(departments, list) or any(department == '' for department in departments):
            departments = []
        
        # 4. Users 정보 조회 및 가공
        auth_list = []
        for user in users:
            user_one = self.db.query(Users).filter(Users.user_id.like(f"%{user}%")).first()
            if user_one is None:
                continue  # 일치하는 사용자가 없으면 건너뜁니다.

            department_id = user_one.department_id
            department_one = self.db.query(Departments).filter(Departments.department_id == department_id).first()
            department_name = department_one.department_name if department_one else "Unknown Department"

            user_information = AuthDetail(
                user_id=user_one.user_id,
                user_name=user_one.name,
                department_name=department_name
            )
            auth_list.append(user_information)
        
        # 응답 반환
        try:
            return {
                "image_id": image_id,
                "auth_list": auth_list
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"이미지 정보 조회 중 오류가 발생했습니다: {str(e)}"
            )