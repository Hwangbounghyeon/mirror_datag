from dto.project_dto import ProjectRequest, ShowProjectList
from configs.mongodb import collection_permissions
from models.mariadb_users import Projects

from sqlalchemy import Session
from datetime import datetime, timezone

class ProjectService:
    def __init__(self, db: Session):
        self.db = db
    
    # Project 생성
    async def create_project(self, request: ProjectRequest):
        # MongoDB permission 저장
        permission_request = {
            "users" : {
                "view": request.accesscontrol.view_users,
                "edit": request.accesscontrol.edit_users
            },
            "department" : {
                "view" : request.accesscontrol.view_departments,
                "edit" : request.accesscontrol.edit_departments
            }
        }
        
        permission = await collection_permissions.insert_one(permission_request)
        
        # MariaDB project 저장
        project_request = ProjectRequest(
            project_name = request.project_name,
            model_name = request.model_name,
            description = request.description,
            accesscontrol_id = str(permission.inserted_id),
            user_id = request.user_id,
            is_private = request.is_private,
            created_at = datetime.now(timezone.utc),
            updated_at = datetime.now(timezone.utc)
        )
        
        self.db.add(project_request)
        self.db.commit()
        self.db.refresh(project_request)
        
        return project_request
    
    # 프로젝트 리스트 불러오기
    async def get_project_list(self, request : ShowProjectList):
        query = {
            "$or" : [
                {"user.view": request.user_id},
                {"user.edit" : request.user_id},
                {"department.view": request.department_id},
                {"department.edit": request.department_id}
            ]
        }
    
        results = await collection_permissions.find(query)

        permissions = []
        for result in results:
            result["_id"] = str(result["_id"])
            permissions.append(result)

        projects = await self.db.query(Projects).filter(Projects.permission_id.in_(permissions))

        if request.selelct_model_name:
            project_list = []
            for project in projects:
                if project.model_name == request.selelct_model_name:
                    project_list.append(project)

        if request.select_department:
            for project in projects:
                if request.select_department == project.model_name:
                    pass

        return projects