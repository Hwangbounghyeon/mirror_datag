from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dto.common_dto import CommonResponse, ErrorResponse
from dto.download_dto import DownloadRequest
from configs.mariadb import get_database_mariadb
from services.download_service import DownloadService

router = APIRouter(prefix="/download", tags=["image download"])

@router.post("")
async def download(request: DownloadRequest, db: Session = Depends(get_database_mariadb)):
    try:
        download_service = DownloadService(db)
        return await download_service.download_image(request)
    except Exception as e:
        return CommonResponse[ErrorResponse](
            status=500,
            error=ErrorResponse(
                code="INTERNAL_SERVER_ERROR",
                message="내부 서버 오류가 발생했습니다.",
                detail=str(e)
            )
        )