from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from models.mariadb_image import TagType


class ImagesBase(BaseModel):
    id: UUID
    image_id: int
    object_id: str
    feature_id: str
    created_at: datetime

class TagsBase(BaseModel):
    id: UUID
    tag_id: int
    tag_name: str
    tag_type: TagType
    created_at: datetime
    updated_at: datetime

class ImageTagBase(BaseModel):
    id: UUID
    image_tag_id: int
    tag_id: int
    image_id: int

