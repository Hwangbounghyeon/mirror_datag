from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from services.user_service import UserCreate, EmailValidate, JWTManage, UserLogin, UserLogout
from dto.common_dto import CommonResponse, ErrorResponse
from dto.users_dto import UserCreateDTO, UserLoginDTO
from models.mariadb_users import Users
from configs.mariadb import get_database_mariadb as get_db

# 회원 및 인증 관련이므로 auth로 묶음
router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

@router.post("/signup", response_model=CommonResponse)
async def signup(user_data: UserCreateDTO, db: Session = Depends(get_db)):
    try:
        user_create = UserCreate(db)
        email_validate = EmailValidate(db)
        
        temp_user_data = await user_create.create_temp_user(user_data)
        await email_validate.send_verification_email(user_data.email, temp_user_data)
        
        return CommonResponse(
            status = 201,
            data = {"message": "이메일 인증 코드가 발송되었습니다."}
        )
    except Exception as e:
        return CommonResponse(
            status=500, 
            data=ErrorResponse(
                code="SIGNUP_ERROR",
                message="회원가입 중 오류가 발생했습니다.",
                detail=str(e)
            )
        )
        

@router.post("/verification", response_model=CommonResponse)
async def verification(email: str, code: str, db: Session = Depends(get_db)):
    try:
        email_validate = EmailValidate(db)
        user = await email_validate.verify_and_create_user(email, code)
        jwt_manage = JWTManage(db)
        
        access_token = jwt_manage.create_access_token(user)
        refresh_token = jwt_manage.create_refresh_token(user.user_id)
        
        return CommonResponse(
            status=200,
            data={
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
            }
        )
    except Exception as e:
        CommonResponse(
            status=500,
            data=ErrorResponse(
                code="VERIFICATION_ERROR",
                message="이메일 인증 과정 중 오류가 발생했습니다.",
                detail=str(e)
            )
        )
        
@router.post("/login", response_model=CommonResponse)
async def login(login_data: UserLoginDTO, db: Session = Depends(get_db)):
    jwt_manage = JWTManage(db)
    user_login = UserLogin(db, jwt_manage)
    
    try:
        result = await user_login.login(login_data)
        return CommonResponse(
            status=200,
            data=result
        )
    except Exception as e:
        return CommonResponse(
            status=401,
            data=ErrorResponse(
                code="LOGIN_ERROR",
                message="로그인에 실패했습니다.",
                detail=str(e)
            )
        )

@router.post("/logout", response_model=CommonResponse)
async def logout(db: Session = Depends(get_db)):
    try:
        user_logout = UserLogout(db)
        return CommonResponse(
            status=200,
            data={"message": "로그아웃 되었습니다."}
        )
    except Exception as e:
        return CommonResponse(
            status=500,
            data=ErrorResponse(
                code="LOGOUT_ERROR",
                message="로그아웃을 할 수 없습니다.",
                detail=str(e)
            )
        )

# 토큰 재발급
@router.post("/refresh", response_model=CommonResponse)
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    jwt_manage = JWTManage(db)
    try:
        payload = jwt_manage.verify_token(refresh_token)
        if payload.get("token_type") != "refresh":
            return CommonResponse(
                status=401,
                data=ErrorResponse(
                    code="INVALID_REFRESH_TOKEN",
                    message="유효하지 않은 Refresh Token 입니다."
                )
            )
            
        # 새로운 토큰 발급을 위한 사용자 정보 조회
        user = db.query(Users).filter(Users.user_id == payload["user_id"]).first()
        
        if not user:
            return CommonResponse(
                status=404,
                data=ErrorResponse(
                    code="INVALID_USER",
                    message="사용자를 찾을 수 없습니다"
                )
            )
        
        new_access_token = jwt_manage.create_access_token(user)
        new_refresh_token = jwt_manage.create_refresh_token(user.user_id)
        
        return CommonResponse(
            status=200,
            data={
                "access_token": new_access_token,
                "refresh_token": new_refresh_token,
                "token_type": "bearer"
            }
        )
        
    except Exception as e:
        return CommonResponse(
            status=500,
            data=ErrorResponse(
                code="TOKEN_ERROR",
                message="유효하지 않은 토큰입니다.",
                detail=str(e)
            )
        )