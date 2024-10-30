from dto.project_dto import ProjectRequest
from configs.mongodb import collection_permissions

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