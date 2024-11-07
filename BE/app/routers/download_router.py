from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from dto.download_dto import DownloadRequest
from dto.common_dto import CommonResponse
from configs.mariadb import get_database_mariadb
from services.download_service import DownloadService

security_scheme = HTTPBearer()

router = APIRouter(prefix="/download", tags=["image download"])

@router.post("")
async def download(
    request: DownloadRequest, 
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        download_service = DownloadService(db)
        return await download_service.download_image(request)
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))