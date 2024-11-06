from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from services.user_service import UserCreate, EmailValidate, JWTManage, UserLogin, UserLogout, UserInformation
from dto.common_dto import CommonResponse
from dto.users_dto import UserSignUp, UserSignIn, UserInfoResponse, TokenResponse
from models.mariadb_users import Users
from configs.mariadb import get_database_mariadb as get_db

# 회원 및 인증 관련이므로 auth로 묶음
router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

@router.post("/signup", response_model=CommonResponse)
async def signup(user_data: UserSignUp, db: Session = Depends(get_db)):
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
        

@router.post("/verification", response_model=CommonResponse[TokenResponse])
async def verification(email: str, code: str, db: Session = Depends(get_db)):
    try:
        email_validate = EmailValidate(db)
        user = await email_validate.verify_and_create_user(email, code)
        jwt_manage = JWTManage(db)
        
        access_token = jwt_manage.create_access_token(user)
        refresh_token = jwt_manage.create_refresh_token(user.user_id)
        
        token_data = {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
        
        return CommonResponse(
            status=200,
            data=TokenResponse.model_validate(token_data)
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
@router.post("/login", response_model=CommonResponse[TokenResponse])
async def login(login_data: UserSignIn, db: Session = Depends(get_db)):
    jwt_manage = JWTManage(db)
    user_login = UserLogin(db, jwt_manage)
    
    try:
        token_data = await user_login.login(login_data)
        return CommonResponse(
            status=200,
            data=token_data
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/logout", response_model=CommonResponse)
async def logout(authorization: str = Header(...), db: Session = Depends(get_db)):
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="인증 정보가 존재하지 않습니다.")
        
        token_datas = authorization.split()
        if len(token_datas) != 2 or token_datas[0].lower() != 'bearer':
            raise HTTPException(status_code=401, detail="JWT 토큰 구조가 옳지 않습니다.")
        
        access_token = token_datas[1]
        user_logout = UserLogout(db)
        logout_data = await user_logout.logout(access_token)
        
        return CommonResponse(
            status=200,
            data=logout_data
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
    
@router.get("/user/me", response_model=CommonResponse[UserInfoResponse])
async def get_user_info(authorizatiopn: str = Header(...), db: Session = Depends(get_db)):
    try:
        if not authorizatiopn:
            raise HTTPException(status_code=401, detail="JWT 토큰이 존재하지 않습니다.")
        '''
        token_datas = "Bearer user_access_token"
        '''
        token_datas = authorizatiopn.split()
        if len(token_datas) != 2 or token_datas[0].lower() != 'bearer':
            raise HTTPException(status_code=401, detail="JWT 토큰 구조가 옳지 않습니다.")
    
        access_token = token_datas[1]
        jwt_manage = JWTManage(db)
        payload = jwt_manage.verify_token(access_token)
        
        if payload.get('token_type') != "access":
            raise HTTPException(status_code=401, detail="JWT 토큰 타입이 옳지 않습니다.")
        
        user_id = payload.get("user_id")
        
        user_info_data = UserInformation(db)
        user_info = await user_info_data.get_user_info(user_id)
        
        return CommonResponse(
            status=200,
            data=user_info
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))