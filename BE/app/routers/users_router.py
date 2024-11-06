from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from services.user_service import UserCreate, EmailValidate, JWTManage, UserLogin, UserLogout
from dto.common_dto import CommonResponse
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
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        

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
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
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
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/logout", response_model=CommonResponse)
async def logout(db: Session = Depends(get_db)):
    try:
        user_logout = UserLogout(db)
        return CommonResponse(
            status=200,
            data={"message": "로그아웃 되었습니다."}
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 토큰 재발급
@router.post("/refresh", response_model=CommonResponse)
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    jwt_manage = JWTManage(db)
    try:
        payload = jwt_manage.verify_token(refresh_token)
        if payload.get("token_type") != "refresh":
            raise HTTPException(status_code=401, detail="유효하지 않은 refreshToken입니다.")
            
        # 새로운 토큰 발급을 위한 사용자 정보 조회
        user = db.query(Users).filter(Users.user_id == payload["user_id"]).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
        
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
        
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))