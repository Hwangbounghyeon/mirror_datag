from fastapi import APIRouter, Depends, HTTPException, Header
from typing import List
from sqlalchemy.orm import Session

from dto.common_dto import CommonResponse
from configs.mariadb import get_database_mariadb
from dto.history_dto import HistoryListResponse

from models.history_models import HistoryData
from services.user_service import JWTManage
from services.history_service import HistoryService

router = APIRouter(prefix="/history", tags=["analysis with dimension reduction"])

@router.get(
    "/{project_id}", 
    response_model=CommonResponse[HistoryListResponse],
)
async def get_history_list(
    project_id: str,
    page: int = 1,
    limit: int = 10,
    authorization: str = Header(None),
    db: Session = Depends(get_database_mariadb)
):
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Verify Token Failed")

        # Bearer 토큰 형식 검증 및 토큰 추출
        token_parts = authorization.split()
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Verify Token Failed")

        access_token = token_parts[1]
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]

        history_service = HistoryService(db)
        results = await history_service.get_histories(project_id, user_id, page, limit)

        return CommonResponse[HistoryListResponse](
            status=200,
            data=results
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/detail/{history_id}", 
    response_model=CommonResponse[HistoryData],
)
async def get_history_detail(
    history_id: str,
    authorization: str = Header(None),
    db: Session = Depends(get_database_mariadb)
):
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Verify Token Failed")

        # Bearer 토큰 형식 검증 및 토큰 추출
        token_parts = authorization.split()
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Verify Token Failed")

        access_token = token_parts[1]
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]

        history_service = HistoryService(db)
        results = await history_service.get_history_detail(history_id)

        return CommonResponse[HistoryData](
            status=200,
            data=results
        )

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))