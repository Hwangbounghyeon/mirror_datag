from configs.mariadb import Base
from sqlalchemy import Column, ForeignKey, Integer, VARCHAR, DateTime, TEXT
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Users(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(VARCHAR(50), nullable=False)
    email = Column(VARCHAR(255), nullable=False)
    password = Column(VARCHAR(255), nullable=False)
    duty = Column(VARCHAR(255), nullable=False)
    location = Column(VARCHAR(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    department = Column(Integer,ForeignKey("departments.department_id"), nullable=True)

    departments = relationship("Departments", back_populates="users")
    projects = relationship("Project", back_populates="users")
    histories = relationship("Histories", back_populates="users")
    upload_batch = relationship("UploadBatch", back_populates="users")



class Departments(Base):
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    department_name = Column(VARCHAR(255), nullable=False)

    users = relationship("Users", back_populates="departments")



class Project(Base):
    __tablename__ = "project"

    project_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    permission_id = Column(VARCHAR(255), nullable=False)
    is_private = Column(Integer, default=0)
    name = Column(VARCHAR(255))
    description = Column(TEXT, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    users = relationship("Users", back_populates="projects")
    project_image = relationship("ProjectImage", back_populates="projects")
    histories = relationship("Histories", back_populates="projects")
    upload_batch = relationship("UploadBatch", back_populates="projects")



class ProjectImage(Base):
    __tablename__ = "project_image"

    project_image = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("project.project_id"))
    image_id = Column(Integer, ForeignKey("images.image_id"))

    projects = relationship("Project", back_populates="project_image")
    images = relationship("Images", back_populates="project_image")



class Histories(Base):
    __tablename__ = "histories"

    history_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    project_id = Column(Integer, ForeignKey("project.project_id"))
    history_name = Column(VARCHAR(255), nullable=False)
    history_obj_id = Column(VARCHAR(255))
    is_private = Column(Integer, nullable=False)
    is_done = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    users = relationship("Users", back_populates="histories")
    projects = relationship("Project", back_populates="histories")

class UploadBatch(Base):
    __tablename__ = "upload_batch"
    upload_batch_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("project.project_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    is_done = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    projects = relationship("Project", back_populates="upload_batch")
    users = relationship("Users", back_populates="upload_batch")

    