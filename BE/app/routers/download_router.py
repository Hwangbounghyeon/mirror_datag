from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dto.common_dto import CommonResponse
from dto.download_dto import DownloadRequest
from configs.mariadb import get_database_mariadb
from services.download_service import DownloadService

router = APIRouter(prefix="/download", tags=["image download"])

@router.post("")
async def download(request: DownloadRequest, db: Session = Depends(get_database_mariadb)):
    try:
        download_service = DownloadService(db)
        return await download_service.download_image(request)
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))