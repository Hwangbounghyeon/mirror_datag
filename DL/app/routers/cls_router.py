from fastapi import APIRouter, Depends, HTTPException
from typing import List

from dto.ai_model_dto import AIModelRequest
from dto.common_dto import CommonResponse, ErrorResponse
from services.ai_model.classification_service import ClassificationService
from configs.mariadb import get_database_mariadb
from sqlalchemy.orm import Session

router = APIRouter(prefix="/cls", tags=["classification"])

@router.post(
    "", 
    response_model=CommonResponse[str],
    responses={
        400: {"model": CommonResponse[ErrorResponse]},
        500: {"model": CommonResponse[ErrorResponse]}
    }
)
async def classify_objects(
    request: AIModelRequest,
    db : Session = Depends(get_database_mariadb)
):
    try:
        classification_service = ClassificationService(db)
        await classification_service.classify_images(request)
        return CommonResponse[str](
            status=200,
            data="success"
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