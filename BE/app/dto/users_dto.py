from pydantic import BaseModel, EmailStr, field_validator

class DepartmentDTO(BaseModel):
    department_id: int
    department_name: str

    # @field_validator('department_name')
    # def not_empty(cls, v):
    #     if not v or not v.strip():
    #         raise ValueError('"departments" 테이블, "department_name"에 유효한 값을 입력해 주세요. 현재 값: "{v}"')
    #     return v

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

    # @field_validator('email', 'password', 'duty', 'location', 'is_supervised')
    # def not_empty(cls, v):
    #     if v is None or (isinstance(v, str) and not v.strip()):
    #         raise ValueError('"users"테이블, f"{field.name}"에 유효한 값을 입력해 주세요. 현재 값: "{v}"')
    #     return v

    class Config:
        from_attributes = True
        
class UserLoginDTO(BaseModel):
    email: str
    password: str
    
    class Config:
        from_attributes = True