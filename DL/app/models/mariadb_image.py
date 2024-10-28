from pydantic import BaseModel
from datetime import datetime

class Image(BaseModel):
    image_id: int
    object_id: int
    feature_id: int
    created_at: datetime
    updated_at: datetime