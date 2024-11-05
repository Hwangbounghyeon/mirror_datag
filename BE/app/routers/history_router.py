from fastapi import APIRouter, Depends, HTTPException, Header
from typing import List
from sqlalchemy.orm import Session

from dto.common_dto import CommonResponse, ErrorResponse
from configs.mariadb import get_database_mariadb
from dto.history_dto import HistoryListResponse

from models.history_models import HistoryData
from services.user_service import JWTManage
from services.history_service import HistoryService

router = APIRouter(prefix="/history", tags=["analysis with dimension reduction"])

@router.get(
    "/{project_id}", 
    response_model=CommonResponse[HistoryListResponse],
    responses={
        400: {"model": CommonResponse[ErrorResponse]},
        500: {"model": CommonResponse[ErrorResponse]}
    }
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
            return CommonResponse[ErrorResponse](
                status=401,
                error=ErrorResponse(
                    code="FAILED_VERIFY_TOKEN",
                    message="토큰 인증에 실패하였습니다.",
                    detail="토큰 인증에 실패하였습니다."
                )
            )
            
        # Bearer 토큰 형식 검증 및 토큰 추출
        token_parts = authorization.split()
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            return CommonResponse[ErrorResponse](
                status=401,
                error=ErrorResponse(
                    code="FAILED_VERIFY_TOKEN",
                    message="토큰 인증에 실패하였습니다.",
                    detail="토큰 인증에 실패하였습니다."
                )
            )

        access_token = token_parts[1]
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]

        history_service = HistoryService(db)
        results = await history_service.get_histories(project_id, user_id, page, limit)

        return CommonResponse[HistoryListResponse](
            status=200,
            data=results
        )

    except Exception as e:
        return CommonResponse[ErrorResponse](
            status=500,
            error=ErrorResponse(
                code="INTERNAL_SERVER_ERROR",
                message="내부 서버 오류가 발생했습니다.",
                detail=str(e)
            )
        )

@router.get(
    "/detail/{history_id}", 
    response_model=CommonResponse[HistoryData],
    responses={
        400: {"model": CommonResponse[ErrorResponse]},
        500: {"model": CommonResponse[ErrorResponse]}
    }
)
async def get_history_detail(
    history_id: str,
    authorization: str = Header(None),
    db: Session = Depends(get_database_mariadb)
):
    try:
        if not authorization:
            return CommonResponse[ErrorResponse](
                status=401,
                error=ErrorResponse(
                    code="FAILED_VERIFY_TOKEN",
                    message="토큰 인증에 실패하였습니다.",
                    detail="토큰 인증에 실패하였습니다."
                )
            )
            
        # Bearer 토큰 형식 검증 및 토큰 추출
        token_parts = authorization.split()
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            return CommonResponse[ErrorResponse](
                status=401,
                error=ErrorResponse(
                    code="FAILED_VERIFY_TOKEN",
                    message="토큰 인증에 실패하였습니다.",
                    detail="토큰 인증에 실패하였습니다."
                )
            )

        access_token = token_parts[1]
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]

        history_service = HistoryService(db)
        results = await history_service.get_history_detail(history_id)

        return CommonResponse[HistoryData](
            status=200,
            data=results
        )

    except Exception as e:
        return CommonResponse[ErrorResponse](
            status=500,
            error=ErrorResponse(
                code="INTERNAL_SERVER_ERROR",
                message="내부 서버 오류가 발생했습니다.",
                detail=str(e)
            )
        )