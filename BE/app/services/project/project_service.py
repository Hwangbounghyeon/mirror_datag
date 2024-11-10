from dto.project_dto import ProjectRequest

from sqlalchemy.orm import Session
from utils.timezone import get_current_time
from datetime import datetime, timezone
from bson import ObjectId

from fastapi import HTTPException
from sqlalchemy.orm import Session
from dto.search_dto import TagImageResponse, SearchCondition, ImageSearchResponse, SearchRequest
from configs.mongodb import (
    collection_tag_images, 
    collection_metadata, 
    collection_images,
    collection_image_permissions, 
    collection_project_images,
    collection_project_histories, 
    collection_project_permissions, 
    collection_projects
)

from dto.pagination_dto import PaginationDto
from dto.project_dto import ProjectRequest, ProjectResponse, DepartmentResponse, UserResponse, UserRequet
from models.mariadb_users import Users, Departments
from typing import List

# 1. 프로젝트 생성, 삭제 및 불러오기
class ProjectService:
    def __init__(self, db: Session):
        self.db = db
    
    # 1-1. Project 생성
    async def create_project(self, creator_user_id: int, request: ProjectRequest) -> str:
        
        user_department = self.db.query(Users).filter(Users.user_id == creator_user_id).first()
        if not user_department:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
        project_department = self.db.query(Departments).filter(Departments.department_id == user_department.department_id).first()
        
        department_name = project_department.department_name if project_department else "None"

        # project 생성
        project = {
            'projectName':request.project_name,
            'task':request.project_model_task,
            'modelName':request.project_model_name,
            'description':request.description,
            'userId':creator_user_id,
            'department': department_name,
            'isPrivate':request.is_private,
            'createdAt':get_current_time(),
            'updatedAt':get_current_time()
        }
        
        new_project = await collection_projects.insert_one(project)
        project_id = str(new_project.inserted_id)
        
        document = await collection_project_permissions.find_one()
        
        # 문서가 없을 경우 새로운 문서 생성
        if document is None:
            new_document = {
                "user": {},
                "department": {}
            }
            await collection_project_permissions.insert_one(new_document)
            document = new_document

        if str(creator_user_id) not in document.get("user", {}):
            await collection_project_permissions.update_one(
                {},
                {"$set": {f"user.{str(creator_user_id)}": {"view": [], "edit": []}}}
            )
        await collection_project_permissions.update_one(
            {},
            {"$addToSet": {f"user.{str(creator_user_id)}.edit": project_id}}
        )

        if department_name not in document.get("department", {}):
            await collection_project_permissions.update_one(
                {},
                {"$set": {f"department.{department_name}": {"view": [], "edit": []}}}
            )
        await collection_project_permissions.update_one(
            {},
            {"$addToSet": {f"department.{department_name}.edit": project_id}}
        )

        for user_id in request.accesscontrol.view_users:
            user_key = f"user.{user_id}"
            if user_id not in document.get("user", {}):
                # `user` 내에 해당 ID가 없으면 새로운 리스트 추가
                await collection_project_permissions.update_one(
                    {},
                    {"$set": {user_key: {"view": [], "edit": []}}}
                )
            # view 리스트에 project_id 추가
            await collection_project_permissions.update_one(
                {},
                {"$addToSet": {f"{user_key}.view": project_id}}
            )
            
        for user_id in request.accesscontrol.edit_users:
            user_key = f"user.{user_id}"
            if user_id not in document.get("user", {}):
                await collection_project_permissions.update_one(
                    {},
                    {"$set": {user_key: {"view": [], "edit": []}}}
                )
            await collection_project_permissions.update_one(
                {},
                {"$addToSet": {f"{user_key}.edit": project_id}}
            )

        # `department` 리스트에 project_id 추가 또는 키 생성
        for department in request.accesscontrol.view_departments:
            department_key = f"department.{department}"
            if department not in document.get("department", {}):
                # `department` 내에 해당 부서가 없으면 새로운 리스트 추가
                await collection_project_permissions.update_one(
                    {"_id": document["_id"]},
                    {"$set": {department_key: {"view": [], "edit": []}}}
                )
            # view 리스트에 project_id 추가
            await collection_project_permissions.update_one(
                {"_id": document["_id"]},
                {"$addToSet": {f"{department_key}.view": project_id}}
            )
            
        for department in request.accesscontrol.edit_departments:
            department_key = f"department.{department}"
            if department not in document.get("department", {}):
                await collection_project_permissions.update_one(
                    {"_id": document["_id"]},
                    {"$set": {department_key: {"view": [], "edit": []}}}
                )
            await collection_project_permissions.update_one(
                {"_id": document["_id"]},
                {"$addToSet": {f"{department_key}.edit": project_id}}
            )
        
        return project_id
    
    # 1-2. 프로젝트 리스트 불러오기
    async def get_project_list(
        self,
        user_id: int,
        model_name: str | None = None,
        page: int = 1,
        limit: int = 10
    ) -> PaginationDto[List[ProjectResponse] | None]:

        skip = (page - 1) * limit
        
        user_department = self.db.query(Users).filter(Users.user_id == user_id).first()
        if not user_department:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
        project_department = self.db.query(Departments).filter(Departments.department_id == user_department.department_id).first()
        department_name = project_department.department_name if project_department else "None"

        user_permissions = await collection_project_permissions.find_one({f"user.{user_id}": {"$exists": True}})
        department_permissions = await collection_project_permissions.find_one({f"department.{department_name}": {"$exists": True}})

        viewable_project_ids_user = set()
        user_edit_permissions = set()
        # 사용자 권한이 없을 경우 빈 리스트 반환
        if user_permissions:
            # 특정 user_id의 view 및 edit 권한 가져오기
            user_view_permissions = set(user_permissions["user"].get(str(user_id), {}).get("view", []))
            user_edit_permissions = set(user_permissions["user"].get(str(user_id), {}).get("edit", []))

            viewable_project_ids_user = user_view_permissions | user_edit_permissions

        viewable_project_ids_department = set()
        department_edit_permissions = set()
        if department_permissions:
            # 특정 user_id의 view 및 edit 권한 가져오기
            department_view_permissions = set(department_permissions["department"].get(str(department_name), {}).get("view", []))
            department_edit_permissions = set(department_permissions["department"].get(str(department_name), {}).get("edit", []))

            viewable_project_ids_department = department_view_permissions | department_edit_permissions

        # view 및 edit 권한의 프로젝트 ID 합집합 구하기
        viewable_project_ids = viewable_project_ids_user | viewable_project_ids_department
        edit_project_ids = user_edit_permissions | department_edit_permissions

        # 조회할 프로젝트가 없으면 빈 리스트 반환
        if not viewable_project_ids:
            response = {
                "data": None,
                "page": page,
                "limit": limit,
                "total_count": 0,
                "total_pages": page
            }
            return response

        # MongoDB 쿼리 생성
        query = {
            "$and": [
                {"_id": {"$in": [ObjectId(pid) for pid in viewable_project_ids]}},
                {
                    "$or": [
                        {"isPrivate": False},  # 공개 프로젝트
                        {
                            "$and": [
                                {"isPrivate": True},
                                {"userId": user_id}  # private이면서 본인 프로젝트
                            ]
                        }
                    ]
                }
            ]
        }
        
        if model_name:
            query["$and"].append({"modelName": model_name})
        
        # MongoDB 쿼리 실행 및 페이지네이션
        projects = await collection_projects.find(query).skip(skip).limit(limit).to_list(length=limit)
        projects.sort(key=lambda x: x['updatedAt'], reverse=True)

        # 결과 형식 맞추기
        results = [
            ProjectResponse(
                project_id=str(project["_id"]),
                project_name=project["projectName"],
                task=project.get("task", ""),
                model_name=project.get("modelName", ""),
                department=project.get("department", ""),
                user_id=project.get("userId", 0),
                description=project.get("description", ""),
                is_private=project.get("isPrivate", False),
                created_at=project.get("createdAt", ""),
                updated_at=project.get("updatedAt", ""),
                is_editor=str(project["_id"]) in edit_project_ids,
                is_creator=project.get("userId", 0) == user_id
            )
            for project in projects
        ]
        
        total_projects = await collection_projects.count_documents(query)
        total_pages = (total_projects + limit - 1) // limit

        response = {
            "data": results,
            "page": page,
            "limit": limit,
            "total_count": total_projects,
            "total_pages": total_pages
        }

        return response
        
    # 1-3. 프로젝트 삭제
    async def delete_project(self, project_id: str):
        # 1. projects에서 삭제
        delete_projects = await collection_projects.delete_one({"_id": ObjectId(project_id)})
        if delete_projects.deleted_count == 0:
            raise HTTPException(status_code=404, detail="프로젝트를 찾을 수 없습니다.")
        
        # 2. projectPermissions에서 삭제
        await collection_project_permissions.update_many(
            {},
            {"$pull": {f"user.$[].view": project_id, f"user.$[].edit": project_id}}
        )
        await collection_project_permissions.update_many(
            {},
            {"$pull": {f"department.Production Management.view": project_id, f"department.Production Management.edit": project_id}}
        )
        
        # 3. projectHistories에서 삭제
        await collection_project_histories.update_one(
            {},
            {"$pull": {f"project.{project_id}": {"$exists": True}}}
        )

        # 4. projectImages에서 삭제
        await collection_project_images.update_one(
            {},
            {"$pull": {f"project.{project_id}": {"$exists": True}}}
        )

        # 5. metadata 에서 삭제
        await collection_metadata.update_many(
            {},
            {"$pull": {"metadata.accessControl.projects": project_id}}
        )

    # # 1-3. 프로젝트 삭제
    # async def delete_project(self, project_id: str):
    #     # MariaDB에서 project 조회 및 삭제
    #     delete_project = await collection_projects.delete_one({"_id": ObjectId(project_id)})
    #     if delete_project.deleted_count == 0:
    #         raise HTTPException(
    #             status_code=404,
    #             detail="프로젝트를 찾을 수 없습니다."
    #         )

    #     document = await collection_project_permissions.find_one({})

    #     if document:
    #         # user 필드에서 project_id 제거
    #         for user_id, permissions in document.get("user", {}).items():
    #             await collection_project_permissions.update_one(
    #                 {"_id": document["_id"]},
    #                 {"$pull": {f"user.{user_id}.view": project_id}}
    #             )
    #             await collection_project_permissions.update_one(
    #                 {"_id": document["_id"]},
    #                 {"$pull": {f"user.{user_id}.edit": project_id}}
    #             )

    #         # department 필드에서 project_id 제거
    #         for department, permissions in document.get("department", {}).items():
    #             await collection_project_permissions.update_one(
    #                 {"_id": document["_id"]},
    #                 {"$pull": {f"department.{department}.view": project_id}}
    #             )
    #             await collection_project_permissions.update_one(
    #                 {"_id": document["_id"]},
    #                 {"$pull": {f"department.{department}.edit": project_id}}
    #             )


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

    async def search_project_images(self, project_id: str, search_request: SearchRequest | None, user_id: int) -> ImageSearchResponse:
        try:
            project_images = await collection_project_images.find_one({})
            if not project_images or "project" not in project_images:
                return ImageSearchResponse(images={})

            project_image_ids = set(project_images["project"].get(project_id, []))
            if not project_image_ids:
                return ImageSearchResponse(images={})
            
            # 검색 조건이 있는 경우에만 필터링 적용
            if search_request and search_request.conditions:
                tag_doc = await collection_tag_images.find_one({})
                if tag_doc:
                    matching_ids = set()
                    for condition in search_request.conditions:
                        group_result = await self._process_condition_group(tag_doc, condition)
                        matching_ids.update(group_result)
                    project_image_ids &= matching_ids

            image_data = {}
            for image_id in project_image_ids:
                image = await collection_images.find_one({"_id": ObjectId(image_id)})
                if image:
                    metadata = await collection_metadata.find_one(
                        {"_id": ObjectId(image["metadataId"])}
                    )
                    if metadata and "fileList" in metadata and metadata["fileList"]:
                        image_data[image_id] = metadata["fileList"][0]

            return ImageSearchResponse(images=image_data)

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # 3. 모델 리스트 호출
    async def get_model_list(self):
        model_list = {
            "cls": ["vgg19_bn", "mobilenetv2_x1_4", "repvgg_a2"],
            "det": ["yolov5n", "yolov8n", "yolo11n"]
        }
        
        return model_list