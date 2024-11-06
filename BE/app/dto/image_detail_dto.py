from pydantic import BaseModel
from typing import List
from models.metadata_models import Metadata

class AuthDetail(BaseModel):
    user_id: int
    user_name: str

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

class ImageDetailTaggingRequest(BaseModel):
    image_id: str
    tag_list: List[str]

class ImageDetailTaggingResponse(BaseModel):
    image_id: str
    tag_name_list: List[str]

class ImageDetailAuthRequest(BaseModel):
    user_id: List[int]
    image_id: str

class ImageDetailAuthResponse(BaseModel):
    image_id: str
    auth: List[AuthDetail]
