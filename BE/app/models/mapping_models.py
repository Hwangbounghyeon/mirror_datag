from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from bson import ObjectId

class ProjectMappingData(BaseModel):
    project: Dict[str, List[str]]


class ProjectImage(BaseModel):
    id: Optional[ObjectId] = Field(None, alias="_id")
    mappingName: str
    mappingData: ProjectMappingData


class TagMappingData(BaseModel):
    tags: Dict[str, List[str]]


class Tags(BaseModel):
    id: Optional[ObjectId] = Field(None, alias="_id")
    mappingName: str
    mappingData: TagMappingData


class PermissionData(BaseModel):
    view: List[str]
    edit: List[str]


class PermissionMappingData(BaseModel):
    user: Dict[str, PermissionData]
    department: Dict[str, PermissionData]


class Permission(BaseModel):
    id: Optional[ObjectId] = Field(None, alias="_id")
    mappingName: str
    mappingData: PermissionMappingData