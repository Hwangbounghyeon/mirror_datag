from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from dto.uploads import UploadBase
from services.upload_service import Upload
from configs.mariadb import get_database_mariadb

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post('/', description="이미지 업로드(zip, image)")
async def image_upload(
    # upload: UploadBase,
    files: list[UploadFile] = File(...),
    db : Session = Depends(get_database_mariadb)
):
    upload = Upload(db)
    base = {
        "user_id" : 1,
        "task": "cls",
        "model_name" : "repvgg_a2",
        "project_id" : 2,
        "is_private" : 0
    }
    file_urls = await upload.upload_image(base, files)

    return file_urls