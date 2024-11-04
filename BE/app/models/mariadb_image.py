from configs.mariadb import Base
from sqlalchemy import Column, ForeignKey, Integer, VARCHAR, DateTime, TIMESTAMP, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum, unique

@unique
class TagType(Enum):
    YEAR = "YEAR"
    MONTH = "MONTH"
    MODEL = "MODEL"
    TASK = "TASK"
    BRANCH = "BRANCH"
    LOCATION = "LOCATION"
    EQUIPMENT = "EQUIPMENT"
    PREDICTION = "PREDICTION"
    USER = "USER"

# 이미지 테이블
class Images(Base):
    __tablename__ = "images"

    image_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    metadata_id = Column(VARCHAR(255))
    feature_id = Column(VARCHAR(255))
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now(), nullable=False)

    image_tags = relationship("ImageTag", back_populates="images")
    project_image = relationship("ProjectImage", back_populates="images")


# 태그 테이블
class Tags(Base):
    __tablename__ = 'tags'

    tag_id = Column(Integer, primary_key=True, autoincrement=True)
    tag_name = Column(VARCHAR(255), nullable=False)
    tag_type = Column(SAEnum(TagType, charset='utf8mb4', collation='utf8mb4_unicode_ci'), nullable=False) 
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())  
    updated_at = Column(TIMESTAMP, nullable=False, server_default=func.now(), onupdate=func.now())
    
    image_tags = relationship("ImageTag", back_populates="tags") 


# 이미지 태그 관계 테이블
class ImageTag(Base):
    __tablename__ = 'image_tag'

    image_tag_id = Column(Integer, primary_key=True, autoincrement=True)
    tag_id = Column(Integer, ForeignKey("tags.tag_id", ondelete="CASCADE"), nullable=False) 
    image_id = Column(Integer, ForeignKey("images.image_id", ondelete="CASCADE"), nullable=False)

    tags = relationship("Tags", back_populates="image_tags")
    images = relationship("Images", back_populates="image_tags")
