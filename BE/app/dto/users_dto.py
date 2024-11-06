from pydantic import BaseModel, EmailStr

class Department(BaseModel):
    department_id: int
    department_name: str
    class Config:
        from_attributes = True

class UserSignUp(BaseModel):
    name: str
    email: EmailStr
    password: str
    duty: str
    location: str
    department_id: int | None = None
    is_supervised: bool
    class Config:
        from_attributes = True
        
class UserSignIn(BaseModel):
    email: str
    password: str
    
    class Config:
        from_attributes = True

class UserInfoResponse(BaseModel):
    user_id: int
    name: str
    email: str
    duty: str
    location: str
    department_id: int | None = None
    is_supervised: bool
    
    class Config:
        from_attributes = True
        
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'
    
    class Confing:
        from_attributes = True