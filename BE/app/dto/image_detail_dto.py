from typing import List
from pydantic import BaseModel
from models.metadata_models import Metadata

class UserInformation(BaseModel):
    uid: int
    name: str
    department_name: str

class AccessControl(BaseModel):
    users: List[UserInformation]
    departments: List[str]

class ImageDetailResponse(BaseModel):
    metadata: Metadata
    access_control: AccessControl

class ImageDetailTagAddRequest(BaseModel):
    image_id: str
    tag_list: List[str]

class ImageDetailTagAddResponse(BaseModel):
    image_id: str
    tag_name_list: List[str]

class ImageDetailTagDeleteRequest(BaseModel):
    image_id: str
    delete_tag_list: List[str]

class ImageDetailTagDeleteResponse(BaseModel):
    image_id: str
    tag_name_list: List[str]

class AuthDetail(BaseModel):
    user_id: int
    user_name: str
    department_name: str

class ImageDepartmentPermissionAddRequest(BaseModel):
    department_name_list: List[str]
    image_id: str

class ImageUserPermissionAddRequest(BaseModel):
    user_id_list: List[int]
    image_id: str

class ImagePermissionAddResponse(BaseModel):
    image_id: str
    auth_list: List[AuthDetail]

class ImagePermissionDeleteRequest(BaseModel):
    user_id_list: List[int]
    image_id: str

class ImagePermissionDeleteResponse(BaseModel):
    image_id: str
    auth_list: List[AuthDetail]