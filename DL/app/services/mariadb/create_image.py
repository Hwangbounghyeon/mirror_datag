from fastapi import HTTPException
from models.mariadb_image import Images, Tags, ImageTag, TagType
from models.mariadb_users import ProjectImage
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime, timezone


class CreateImage:
    def __init__(self, db: Session):
        self.db = db

    async def create_image(self, object_idx: str, feature_idx: str) -> int:
        image = Images(
            object_id=object_idx,
            feature_id=feature_idx,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )

        self.db.add(image)
        self.db.commit()
        self.db.refresh(image)
        
        return image.image_id

    async def create_tags(self, tag_names: list[str]) -> list[int]:
        tag_ids = []
        
        # tag_name에 따른 tag_type 결정
        def get_tag_type(tag_name: str) -> TagType:
            if tag_name in ["vgg19_bn", "mobilenetv2_x1_4", "repvgg_a2", "yolov5n", "yolov8n", "yolo11n"]:
                return TagType.MODEL
            elif tag_name in ["Classification", "Object Detection"]:
                return TagType.TASK
            elif tag_name.isdigit() and int(tag_name) in range(1900, datetime.now().year):  # 연도 체크
                return TagType.DATE
            elif tag_name.isdigit() and 1 <= int(tag_name) <= 12:  # 월 체크
                return TagType.DATE
            elif tag_name in ["Seoul", "Gumi", "Daejeon", "Gwangju", "Busan"]:
                return TagType.BRANCH
            elif tag_name in ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]:
                return TagType.LOCATION
            elif tag_name in ["EdgeDevice01", "EdgeDevice02", "EdgeDevice03", "EdgeDevice04", "EdgeDevice05"]:
                return TagType.EQUIPMENT
            else:
                return TagType.USER

        for tag_name in tag_names:
            tag_type = get_tag_type(tag_name)  # 각 tag_name에 맞는 tag_type 결정
            existing_tag = self.db.execute(select(Tags).filter_by(tag_name=tag_name)).scalar_one_or_none()
            
            if existing_tag:
                # 태그가 이미 존재하면 기존 tag_id 추가
                tag_ids.append(existing_tag.tag_id)
            else:
                # 태그가 존재하지 않으면 새로 생성
                tag = Tags(
                    tag_name=tag_name,
                    tag_type=tag_type,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc)
                )
                self.db.add(tag)
                self.db.commit()
                self.db.refresh(tag)
                tag_ids.append(tag.tag_id)
                
        return tag_ids

    async def create_image_tags(self, image_id: int, tag_ids: list[int]) -> list[int]:
        image_tag_ids = []
        for tag_id in tag_ids:
            image_tag = ImageTag(
                image_id=image_id,
                tag_id=tag_id
            )
            self.db.add(image_tag)
            self.db.commit()
            self.db.refresh(image_tag)
            image_tag_ids.append(image_tag.image_tag_id)

        return image_tag_ids
    
    async def create_project_image(self, project_id: int, image_id: int) -> int:
        project_image = ProjectImage(
            project_id=project_id,
            image_id=image_id
        )

        self.db.add(project_image)
        self.db.commit()
        self.db.refresh(project_image)
        
        return project_image.project_image_id


