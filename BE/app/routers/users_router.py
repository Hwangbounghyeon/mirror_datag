from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from services.user_service import UserCreate, EmailValidate, JWTManage, UserLogin, UserLogout
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
        jwt_manage = JWTManage(db)
        token_data = {
            "user_id": user.user_id,
            "email": user.email,
            "department": user.department,
            "is_supervised": user.is_supervised
        }
        
        access_token = jwt_manage.create_access_token(token_data)
        refresh_token = jwt_manage.create_refresh_token({"user_id": user.user_id})
        
        return {
            "message": "회원가입이 완료되었습니다",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": token_data
        }
    except Exception as e:
        print(f"Verification error: {str(e)}")  # 에러 로깅 추가
        raise HTTPException(
            status_code=500,
            detail=f"인증 처리 중 오류가 발생했습니다: {str(e)}"
        )
@router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    login_data: UserLoginDTO,
    db: Session = Depends(get_db)
):
    jwt_manage = JWTManage(db)
    user_login = UserLogin(db, jwt_manage)
    return await user_login.login(login_data)

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    db: Session = Depends(get_db)
):
    user_logout = UserLogout(db)
    return await user_logout.logout()

# 토큰 재발급
@router.post("/refresh")
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    jwt_manage = JWTManage(db)
    try:
        payload = jwt_manage.verify_token(refresh_token)
        if payload.get("token_type") != "refresh":
            raise HTTPException(status_code=401, detail="유효하지 않은 refresh token입니다")
            
        # 새로운 토큰 발급을 위한 사용자 정보 조회
        user = db.query(Users).filter(Users.user_id == payload["user_id"]).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")
            
        # 새로운 access token 생성
        token_data = {
            "user_id": user.user_id,
            "email": user.email,
            "department": user.department,
            "is_supervised": user.is_supervised
        }
        
        new_access_token = jwt_manage.create_access_token(token_data)
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다")