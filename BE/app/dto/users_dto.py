from pydantic import BaseModel, EmailStr

class DepartmentDTO(BaseModel):
    department_id: int
    department_name: str
    class Config:
        from_attributes = True


class UserCreateDTO(BaseModel):
    name: str
    email: EmailStr
    password: str
    duty: str
    location: str
    department_id: int | None = None
    is_supervised: bool
    class Config:
        from_attributes = True
        
class UserLoginDTO(BaseModel):
    email: str
    password: str
    
    class Config:
        from_attributes = True