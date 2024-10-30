from datetime import datetime
from configs.mariadb import Base
from models.mariadb_image import Images

from sqlalchemy import (
    Column, ForeignKey, Integer, VARCHAR, DateTime, TEXT, Boolean, String, TIMESTAMP
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Departments(Base):
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    department_name = Column(VARCHAR(255), nullable=False)

    users = relationship("Users", back_populates="departments")

class Users(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(VARCHAR(255), nullable=False)
    email = Column(VARCHAR(255), unique=True, nullable=False)
    password = Column(VARCHAR(255), nullable=False)
    duty = Column(VARCHAR(255), nullable=False)
    location = Column(VARCHAR(255), nullable=False)
    department = Column(Integer, ForeignKey('departments.department_id', ondelete="SET NULL"), nullable=True)
    is_supervised = Column(Boolean, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.now(), nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.now(), onupdate=datetime.now(), nullable=False)

    departments = relationship("Departments", back_populates="users")
    projects = relationship("Projects", back_populates="users")
    histories = relationship("Histories", back_populates="users")
    upload_batches = relationship("UploadBatches", back_populates="users")



class Projects(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    permission_id = Column(VARCHAR(255), nullable=False) # MongoDB reperence
    is_private = Column(Boolean, nullable=False, default=0)
    project_name = Column(VARCHAR(255), nullable=False)
    model_name = Column(VARCHAR(255), nullable=False)
    description = Column(TEXT, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now(), nullable=False)

    users = relationship("Users", back_populates="projects")
    project_image = relationship("ProjectImage", back_populates="projects")
    histories = relationship("Histories", back_populates="projects")
    upload_batches = relationship("UploadBatches", back_populates="projects")



class ProjectImage(Base):
    __tablename__ = "project_image"

    project_image = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("project.project_id", ondelete="CASCADE"), nullable=False)
    image_id = Column(Integer, ForeignKey("images.image_id", ondelete="CASCADE"), nullable=False)

    projects = relationship("Projects", back_populates="project_image")
    images = relationship("Images", back_populates="project_image")



class Histories(Base):
    __tablename__ = "histories"

    history_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"))
    project_id = Column(Integer, ForeignKey("project.project_id", ondelete="CASCADE"), nullable=False)
    history_name = Column(VARCHAR(255), nullable=False)
    history_obj_id = Column(VARCHAR(255)) # MongoDB reference
    is_private = Column(Boolean, nullable=False)
    is_done = Column(Boolean, nullable=False, default=0)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now(), nullable=False)

    users = relationship("Users", back_populates="histories")
    projects = relationship("Projects", back_populates="histories")

class UploadBatches(Base):
    __tablename__ = "upload_batches"
    upload_batch_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("project.project_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"))
    is_done = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now(), nullable=False)

    projects = relationship("Projects", back_populates="upload_batches")
    users = relationship("Users", back_populates="upload_batches")

    