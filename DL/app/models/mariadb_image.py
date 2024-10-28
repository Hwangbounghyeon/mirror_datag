from configs.mariadb import Base
from sqlalchemy import Column, ForeignKey, Integer, VARCHAR, DateTime
from sqlalchemy.orm import relationship
from enum import Enum, unique



@unique
class TagType(Enum):
    DATE = "DATE"
    MODEL = "MODEL"
    TASK = "TASK"
    BRANCH = "BRANCH"
    LOCATION = "LOCATION"
    EQUIPMENT = "EQUIPMENT"
    USER = "USER"



# 이미지 테이블
class Images(Base):
    __table__ = "images"

    image_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    metadata_id = Column(VARCHAR(255))
    feature_id = Column(VARCHAR(255))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    image_tag = relationship("ImageTag", back_populates="images")
    dataset_image = relationship("DatasetImage", back_populates="images")



# 태그 테이블
class Tags(Base):
    __table__ = 'tags'

    tag_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag_name = Column(VARCHAR(255))
    tag_type = Column(Enum(TagType), default=TagType.USER)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    image_tag = relationship("ImageTag", back_populates="tags")



# 이미지 태그 관계 테이블
class ImageTag(Base):
    __table__ = 'image_tag'

    image_tag_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag_id = Column(Integer, ForeignKey("tags.tag_id"))
    image_id = Column(Integer, ForeignKey("images.image_id"))

    tags = relationship("Tags", back_populates="image_tag")
    images = relationship("Images", back_populates="image_tag")
