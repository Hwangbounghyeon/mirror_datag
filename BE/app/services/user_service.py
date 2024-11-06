import json
import jwt
import redis
import os
import secrets
import smtplib

from datetime import datetime, timedelta
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dto.users_dto import UserSignUp, UserSignIn, UserInfoResponse, TokenResponse
from fastapi import HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from models.mariadb_users import Users

load_dotenv()

# 필수기능

## 1. 회원가입
class UserCreate:
    def __init__(self, db: Session):
        # DB session을 받아 초기화 하고, 비밀번호를 bcrypt로 해싱.
        self.db = db
        self.pwd_context = CryptContext(schemes=["bcrypt"])

    # 임시로 사용자 생성(UserSchema로 들어오는 데이터 검증)
    async def create_temp_user(self, user_data: UserSignUp):
        if self._check_existing_email(user_data.email):
            raise HTTPException(status_code=400, detail="해당 이메일이 이미 존재합니다.")
            
        # 비밀번호 해싱
        hashed_password = self.pwd_context.hash(user_data.password)
        
        # user_data를 DTO -> Dict로 변환하고 그 중 비밀번호를 hash된 비밀번호로 교체한다.
        temp_user_data = user_data.model_dump()
        temp_user_data["password"] = hashed_password
        
        return temp_user_data
    
    # 이메일 중복 체크
    def _check_existing_email(self, email: str) -> bool:
        result = self.db.query(Users).filter(Users.email == email).first()
        return bool(result)
    
        
## 2. 회원가입 이메일 인증
class EmailValidate:
    def __init__(self, db: Session):
        # DB session을 받아서 초기화
        self.db = db
        
        try:
            redis_host = os.getenv('REDIS_HOST')
            redis_port = int(os.getenv('REDIS_PORT', 6379))
            redis_password = os.getenv('REDIS_PASSWORD')
            
            # Redis 클라이언트 설정(같은 네트워크로 묶을 것이므로 localhost에 연결, decode_response=True로 하면 반환값을 자동으로 문자열로 디코딩)
            self.redis_client = redis.Redis(
                host=redis_host,
                port=redis_port,
                password=redis_password,
                db=0,
                decode_responses=True
            )
            # Redis 연결 테스트
            self.redis_client.ping()
            
        except Exception as e:
            raise Exception(f"Redis 연결 실패: {str(e)}")
        
        self.verification_expire_seconds = 180
        self.max_attempts = 5
        self.attempt_expire_seconds = 3600
        
    async def send_verification_email(self, email: str, temp_user_data: dict):
        # Redis에 인증 정보 저장
                
        try:
            # 이전 인증 시도 횟수 확인 후 진행
            attempt_key = f"attempt:{email}"
            attempt_count = self.redis_client.get(attempt_key)
            
            if attempt_count and int(attempt_count) >= self.max_attempts:
                raise HTTPException(
                    status_code=400,
                    detail="이메일 인증 시도 너무 많습니다. 1시간 후에 다시 시도해주세요."
                )
            
            # 인증 코드 생성
            verification_code = secrets.token_urlsafe(6)
            
            # Redis에 인증 정보 저장
            await self._store_verification_data(email, verification_code, temp_user_data)
            
            await self._send_email(email, verification_code)
            return verification_code
        except Exception as e:
            # 이메일 발송 실패시 Redis 데이터 삭제
            await self._remove_verification_data(email)
            raise HTTPException(
                status_code=500,
                detail=f"이메일 인증코드 전송에 실패했습니다: {str(e)}"
            )

    async def verify_and_create_user(self, email: str, code: str):
        
        # Redis에서 저장된 인증 정보 확인
        stored_data = await self._get_verification_data(email)
        if not stored_data:
            raise HTTPException(
                status_code=400,
                detail="인증코드가 존재하지 않습니다."
            )

        stored_data = json.loads(stored_data)
        if stored_data['code'] != code:
            raise HTTPException(
                status_code=400,
                detail="유효하지 않은 인증코드입니다"
            )

        try:
            new_user = Users(**stored_data['user_data'])
            self.db.add(new_user)
            self.db.commit()
            self.db.refresh(new_user)
            
            # 인증 완료 후 Redis 데이터 삭제
            await self._remove_verification_data(email)
            
            return new_user
        except Exception as e:
            #  DB에 회원 정보 저장 실패
            self.db.rollback()
            print(f"DB 저장에 실패하였습니다: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="회원가입에 실패하였습니다"
            )

    async def _store_verification_data(self, email: str, code: str, user_data: dict):
        try:
            # Redis Transaction
            pipe = self.redis_client.pipeline()
            
            verification_key = f"이메일 인증:{email}"
            attempt_key  = f"attempt:{email}"
            
            # 이전 인증 데이터 삭제
            pipe.delete(verification_key)
            
            verification_data = {
                'code': code,
                'user_data': user_data,
                'created_at': datetime.now().isoformat(),
                'attempts': 0
            }
            pipe.setex(
                verification_key,
                self.verification_expire_seconds,
                json.dumps(verification_data)
            )
            
            pipe.incr(attempt_key)
            pipe.expire(attempt_key, self.attempt_expire_seconds)
            
            # Pipe는 transaction으로 묶여서 실행
            pipe.execute()
        except Exception as e:
            raise Exception(f"Redis 인증 데이터 저장에 실패했습니다: {str(e)}")

    async def _get_verification_data(self, email: str) -> str:
        return self.redis_client.get(f"이메일 인증:{email}")

    async def _remove_verification_data(self, email: str):
        self.redis_client.delete(f"이메일 인증:{email}")

    async def _send_email(self, email: str, code: str):
        # Postfix 서버를 이용해서 메일 전송
        try:
            msg = MIMEMultipart()
            admin_email = os.getenv('ADMINISTRATOR_EMAIL')
            smtp_host = os.getenv('SMTP_HOST')
            smtp_port = int(os.getenv('SMTP_PORT', 587))
            smtp_password = os.getenv('SMTP_PASSWORD')

            print(f"SMTP 설정 확인 - Host: {smtp_host}, Port: {smtp_port}, From: {admin_email}")
            
            msg['From'] = admin_email
            msg['To'] = email
            msg['Subject'] = "이메일 인증"

            body = f"인증 코드: {code}\n\n코드를 확인 후 입력해주세요."
            msg.attach(MIMEText(body, 'plain'))
            
            # print("SMTP 서버 연결 시도...")
            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                # print("TLS 시작...")
                server.starttls()  # TLS 보안 연결
                # print("로그인 시도...")
                server.login(admin_email, smtp_password)  # Gmail 로그인
                # print("이메일 전송 시도...")
                server.send_message(msg)
                # print("이메일 전송 성공")
        except Exception as e:
            error_msg = f"메일 발송 실패 - 상세 오류: {str(e)}"
            print(error_msg)
            print(f"상세 에러 정보: {type(e).__name__}")
            raise HTTPException(
                status_code=500,
                detail=error_msg
            )

## 3. JWT
class JWTManage:
    def __init__(self, db: Session):
        self.db = db
        self.secret_key = os.getenv('JWT_SECRET_KEY')
        self.access_token_expire_minutes = 60
        self.refresh_token_expire_days = 7
        self.algorithm = "HS256"
    
    def create_token(self, data: dict, is_refresh: bool = False):
        to_encode = data.copy()
        
        if is_refresh:
            # Refresh 토큰 생성
            expire = datetime.now() + timedelta(days=self.refresh_token_expire_days)
            to_encode.update({"token_type": "refresh"})
        else:
            # Access 토큰 생성
            expire = datetime.now() + timedelta(minutes=self.access_token_expire_minutes)
            to_encode.update({"token_type": "access"})
            
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
    
    def create_access_token(self, user: Users):
        user_data = {
            "user_id": user.user_id,
            "email": user.email,
            "department_id": user.department_id,
            "is_supervised": user.is_supervised
        }
        return self.create_token(user_data, is_refresh=False)
    
    def create_refresh_token(self, user_id: int):
        return self.create_token({"user_id": user_id}, is_refresh=True)
        
    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="토큰의 기간이 만료되었습니다.")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="사용할 수 없는 토큰입니다.")

## 4. 로그인
class UserLogin:
    def __init__(self, db: Session, jwt_manage: JWTManage):
        self.db = db
        self.jwt_manage = jwt_manage
        self.pwd_context = CryptContext(schemes=["bcrypt"])

    async def login(self, login_data: UserSignIn) -> token:
        # 이메일 검증
        user = self.db.query(Users).filter(Users.email == login_data.email).first()
        if not user:
            raise HTTPException(
                status_code=401,
                detail="존재하지 않거나 틀린 사용자입니다."
            )
        # 비밀번호 검증
        if not self.pwd_context.verify(login_data.password, user.password):
            raise HTTPException(
                status_code=401,
                detail="비밀번호가 틀렸습니다."
            )
        
        access_token = self.jwt_manage.create_access_token(user)
        refresh_token = self.jwt_manage.create_refresh_token(user.user_id)
        token_data = {
            "access_token": access_token,
            "refresh_token": refresh_token
            }
        
        return TokenResponse.model_validate(token_data)

## 5. 로그아웃
class UserLogout:
    def __init__(self, db: Session):
        self.db = db
        
        try:
            redis_host = os.getenv('REDIS_HOST')
            redis_port = int(os.getenv('REDIS_PORT', 6379))
            redis_password = os.getenv('REDIS_PASSWORD')
            
            self.redis_client = redis.Redis(
                host=redis_host,
                port=redis_port,
                password=redis_password,
                db=0,
                decode_responses=True
            )
            self.redis_client.ping()
            
        except Exception as e:
            raise Exception(f"Redis 연결 실패: {str(e)}")
        
    async def logout(self, access_token: str):
        try:
            jwt_manager = JWTManage(self.db)
            payload = jwt_manager.verify_token(access_token)
            
            expire_timestamp = payload.get('exp')
            if not expire_timestamp:
                raise HTTPException(status_code=400, detail="JWT 토큰 구조가 옳지 않습니다.")
            
            current_timestamp = datetime.now().timestamp()
            ttl = int(expire_timestamp - current_timestamp)
            
            if ttl > 0:
                self.redis_client.setex(f"bl_access_token:{access_token}", ttl, 1)
            
            return {"message": "성공적으로 로그아웃이 되었습니다"}
        except HTTPException as http_exc:
            raise http_exc
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"로그아웃 처리 중 오류가 발생했습니다: {str(e)}"
            )        
    

## 6. 유저 정보 조회
class UserInformation:
    def __init__(self, db: Session):
        self.db = db
        
    async def get_user_info(self, user_id: int) -> UserInfoResponse:
        try:
            user = self.db.query(Users).filter(Users.user_id == user_id).first()
            
            if not user:
                raise HTTPException(
                    status_code=404,
                    detail="사용자를 찾을 수 없습니다."
                )
                
            return UserInfoResponse.model_validate(user)
            
        except HTTPException as http_exc:
            raise http_exc
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"사용자 정보를 불러오는데 실패하였습니다: {str(e)}"
            )

## 7. 유저 프로필
class UserProfile:
    pass
    



# 부가 기능
## 1. 프로필 화면

## 2. 프로필 수정(이미지, 비밀번호) / (고도화 - 부서, 직급 수정은 관리자만)

## 3. 비밀번호 분실 시 이메일로 재발급