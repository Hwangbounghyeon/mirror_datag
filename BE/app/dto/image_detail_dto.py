from pydantic import BaseModel
from typing import List
from models.metadata_models import Metadata

class AuthDetail(BaseModel):
    user_id: int
    user_name: str

class TagDetail(BaseModel):
    tag_id: int
    tag_name: str

class UserInformation(BaseModel):
    uid: int
    name: str
    department_name: str

class AccessControl(BaseModel):
    user: List[UserInformation]
    department: List[str]

class ImageDetailRequest(BaseModel):
    image_id: int

class ImageDetailResponse(BaseModel):
    metadata: Metadata
    access_control: AccessControl

class ImageDetailTagRequest(BaseModel):
    user_id: int
    image_id: int
    image_tag_list: List[str]

class ImageDetailTagResponse(BaseModel):
    user_id: int
    image_id: int
    image_tag: List[TagDetail]

class ImageDetailAuthRequest(BaseModel):
    user_id: List[int]
    image_id: int

class ImageDetailAuthResponse(BaseModel):
    image_id: int
    auth: List[AuthDetail]
