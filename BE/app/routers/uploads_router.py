import json
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from dto.common_dto import CommonResponse
from dto.uploads_dto import UploadRequest
from services.user_service import JWTManage
from services.upload_service import Upload
from configs.mariadb import get_database_mariadb

security_scheme = HTTPBearer()

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post('', description="이미지 업로드(zip, image)")
async def image_upload(
    upload_request: str = Form(...),
    files: list[UploadFile] = File(...),
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db : Session = Depends(get_database_mariadb)
):
    try:
        access_token = credentials.credentials
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]

        parsed_request = json.loads(upload_request)
        upload_request_obj = UploadRequest(**parsed_request)

        upload = Upload(db)
        file_urls = await upload.upload_image(upload_request_obj, files, user_id)

        return CommonResponse(
            status=200,
            data=file_urls
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))