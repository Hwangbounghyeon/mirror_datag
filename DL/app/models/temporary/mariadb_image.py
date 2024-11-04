from configs.mariadb import Base
from sqlalchemy import Column, ForeignKey, Integer, VARCHAR, DateTime, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum, unique
from models.mariadb_users import ProjectImage



# 이미지 테이블
class Images(Base):
    __tablename__ = "images"

    image_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    metadata_id = Column(VARCHAR(255))
    feature_id = Column(VARCHAR(255))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    image_tag = relationship("ImageTag", back_populates="images")
    project_image = relationship(ProjectImage, back_populates="images")


# 태그 테이블
class Tags(Base):
    __tablename__ = 'tags'

    tag_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag_name = Column(VARCHAR(255))
    tag_type = Column(SAEnum(TagType), default=TagType.USER)  
    created_at = Column(DateTime, default=func.now())  
    updated_at = Column(DateTime, onupdate=func.now())  

    image_tag = relationship("ImageTag", back_populates="tags")


# 이미지 태그 관계 테이블
class ImageTag(Base):
    __tablename__ = 'image_tag'

    image_tag_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag_id = Column(Integer, ForeignKey("tags.tag_id"))
    image_id = Column(Integer, ForeignKey("images.image_id"))

    tags = relationship("Tags", back_populates="image_tag")
    images = relationship("Images", back_populates="image_tag")
