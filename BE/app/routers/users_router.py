from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from services.user_service import UserCreate, EmailValidate
from dto.users_dto import UserCreateDTO, UserLoginDTO
from models.mariadb_users import Users
from configs.mariadb import get_database_mariadb as get_db

# 회원 및 인증 관련이므로 auth로 묶음
router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreateDTO, db: Session = Depends(get_db)):
    user_create = UserCreate(db)
    temp_user_data = await user_create.create_temp_user(user_data)
    
    email_validate = EmailValidate(db)
    await email_validate.send_verification_email(user_data.email, temp_user_data)
    
    return {"message": "이메일 인증 코드가 전송되었습니다"}

@router.post("/verification")
async def verification(
    email: str,
    code: str,
    db: Session = Depends(get_db)
):
    try:
        email_validate = EmailValidate(db)
        user = await email_validate.verify_and_create_user(email, code)
        
        return {
            "message": "회원가입이 완료되었습니다",
        }
    except Exception as e:
        print(f"Verification error: {str(e)}")  # 에러 로깅 추가
        raise HTTPException(
            status_code=500,
            detail=f"인증 처리 중 오류가 발생했습니다: {str(e)}"
        )
