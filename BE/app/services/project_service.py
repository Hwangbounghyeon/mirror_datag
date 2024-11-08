from dto.project_dto import ProjectRequest
from configs.mongodb import collection_project_images, collection_metadata, collection_project_histories, collection_project_permissions, collection_projects

from sqlalchemy.orm import Session
from utils.timezone import get_current_time
from datetime import datetime, timezone
from bson import ObjectId

from fastapi import HTTPException
from sqlalchemy.orm import Session

from dto.pagination_dto import PaginationDto
from dto.project_dto import ProjectRequest, ProjectResponse, ProjectListRequest, DepartmentResponse, UserResponse, ProjectListResponse
from models.mariadb_users import Projects, Users, Departments, ProjectImage
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
            'project_name':request.project_name,
            'model_name':request.project_model_name,
            'description':request.description,
            'user_id':creator_user_id,
            'department': department_name,
            'image_count': 0,
            'is_private':request.is_private,
            'created_at':get_current_time(),
            'updated_at':get_current_time()
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
        page: int = 0,
        limit: int = 10
    ) -> PaginationDto[ProjectResponse]:

        skip = (page - 1) * limit
        
        user_department = self.db.query(Users).filter(Users.user_id == user_id).first()
        if not user_department:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
        project_department = self.db.query(Departments).filter(Departments.department_id == user_department.department_id).first()
        department_name = project_department.department_name if project_department else "None"

        user_permissions = await collection_project_permissions.find_one({f"user.{user_id}": {"$exists": True}})
        department_permissions = await collection_project_permissions.find_one({f"department.{department_name}": {"$exists": True}})

        # 사용자 권한이 없을 경우 빈 리스트 반환
        if user_permissions:
            # 특정 user_id의 view 및 edit 권한 가져오기
            user_view_permissions = user_permissions["user"].get(str(user_id), {}).get("view", [])
            user_edit_permissions = user_permissions["user"].get(str(user_id), {}).get("edit", [])

            viewable_project_ids_user = set(user_view_permissions) | set(user_edit_permissions)

        if department_permissions:
            # 특정 user_id의 view 및 edit 권한 가져오기
            department_view_permissions = department_permissions["department"].get(str(department_name), {}).get("view", [])
            department_edit_permissions = department_permissions["department"].get(str(department_name), {}).get("edit", [])

            viewable_project_ids_department = set(department_view_permissions) | set(department_edit_permissions)

        # view 및 edit 권한의 프로젝트 ID 합집합 구하기
        viewable_project_ids = viewable_project_ids_user | viewable_project_ids_department

        # 조회할 프로젝트가 없으면 빈 리스트 반환
        if not viewable_project_ids:
            return []

        # MongoDB 쿼리 생성
        query = {"_id": {"$in": [ObjectId(pid) for pid in viewable_project_ids]}}
        
        # 추가 조건
        conditions = []
        if model_name:
            conditions.append({"model_name": model_name})

        # 조건을 추가한 필터링
        if conditions:
            query["$or"] = conditions
        
        # MongoDB 쿼리 실행 및 페이지네이션
        projects = await collection_projects.find(query).skip(skip).limit(limit).to_list(length=limit)

        # 결과 형식 맞추기
        results = [
            ProjectResponse(
                project_id=str(project["_id"]),
                project_name=project["project_name"],
                model_name=project.get("model_name", ""),
                department=project.get("department", ""),
                user_id=project.get("user_id", ""),
                description=project.get("description", ""),
                image_count=project.get("image_count", ""),
                is_private=project.get("is_private", ""),
                created_at=project.get("created_at", ""),
                updated_at=project.get("updated_at", "")
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


# 2. 이름 검색 및 부서 불러오기
class ProjectSubService:
    def __init__(self, db: Session):
        self.db = db
    
    # 2-1. 부서 리스트 불러오기
    async def get_department_list(self):
        departments = self.db.query(Departments).all()
        return [DepartmentResponse.model_validate(dept).model_dump() for dept in departments]
    
    # 2-2. 이름 검색
    async def search_user_name(self, name: str):
        users = self.db.query(Users).filter(Users.name.like(f"%{name}%")).all()
        user_list = []
        for user in users:
            user_one = UserResponse(
                user_id = user.user_id,
                name = user.name,
                email = user.email
            )
            user_list.append(user_one)

        return user_list
        
        
