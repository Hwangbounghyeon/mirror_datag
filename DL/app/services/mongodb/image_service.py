from fastapi import HTTPException
from typing import List
from configs.mongodb import collection_metadata, collection_features, collection_images, collection_project_images, collection_image_permissions
from models.feature_models import Feature
from models.image_models import ImageData
from datetime import datetime, timezone

class ImageService:
    def __init__(self):
        pass

    def _create_images(self, metadata_id: str, feature_id: str) -> ImageData:
        image_obj = {
            "metadataId": metadata_id,
            "featureId": feature_id,
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc)
        }   

        return ImageData.model_validate(image_obj)

    # 차원축소 기록 저장 (mongodb)
    async def save_images_mongodb(self, metadata_id: str, feature_id: str):
        try:
            image_obj = self._create_images(metadata_id, feature_id)
            result = await collection_images.insert_one(image_obj.model_dump())

            if result.inserted_id:
                return str(result.inserted_id)
            else:
                raise HTTPException(status_code=500, detail="Failed to save images")
        except Exception as e:
            raise Exception(f"Failed to update results: {str(e)}")

    async def mapping_project_images_mongodb(self, project_id: str, image_id: str):
        try:
            existing_doc = await collection_project_images.find_one()

            current_images = existing_doc.get("project", {}).get(str(project_id))

            if current_images is None:
                current_images = []

            updated_images = list(set(current_images + [image_id]))

            await collection_project_images.update_one(
                {},
                {
                    "$set": {
                        f"project.{str(project_id)}": updated_images
                    }
                }
            )
        except Exception as e:
            raise Exception(f"Failed to update results: {str(e)}")

    async def mapping_image_permissions_mongodb(self, user_id: str, department_name: str, project_id: str, image_id: str):
        try:
            existing_doc = await collection_image_permissions.find_one()

            image_permissions = existing_doc.get("image", {}).get(str(image_id))

            if image_permissions is None:
                image_permissions = {
                    "user": [],
                    "project": [], 
                    "department": []
                }

            current_user_permissions = image_permissions.get("user", [])
            current_project_permissions = image_permissions.get("project", [])
            current_department_permissions = image_permissions.get("department", [])

            updated_user_permissions = list(set(current_user_permissions + [user_id]))
            updated_project_permissions = list(set(current_project_permissions + [project_id]))
            updated_department_permissions = list(set(current_department_permissions + [department_name]))

            await collection_image_permissions.update_one(
                {},
                {
                    "$set": {
                        f"image.{str(image_id)}.user": updated_user_permissions,
                        f"image.{str(image_id)}.project": updated_project_permissions,
                        f"image.{str(image_id)}.department": updated_department_permissions
                    }
                }
            )
        except Exception as e:
            raise Exception(f"Failed to update results: {str(e)}")