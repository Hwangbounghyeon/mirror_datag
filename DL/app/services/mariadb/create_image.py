from fastapi import HTTPException
from models.mariadb_image import Images, Tags, ImageTag
from sqlalchemy.orm import Session
from datetime import datetime, timezone

class CreateImage:
    def __init__(self):
        pass

    async def create_image(self,object_idx: str, feature_idx: str, db: Session):
        image = Images(
            object_id = object_idx,
            feature_id = feature_idx,
            created_at = datetime.now(timezone.utc).isoformat(),
            updated_at = datetime.now(timezone.utc).isoformat()
        )

        db.add(image)
        db.commit()
        db.refresh(image)
    


    async def create_tag(self, image_id: int, db: Session):
        
        image_tag = ImageTag
        return 


