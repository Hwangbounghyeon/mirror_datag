from fastapi import APIRouter, Depends, HTTPException
from typing import List

from dto.ai_model_dto import AIModelRequest
from services.ai_model.detection_service import ObjectDetectionService
from configs.mariadb import get_database_mariadb
from sqlalchemy.orm import Session

router = APIRouter(prefix="/det", tags=["object_detection"])

@router.post("/")
async def detect_objects(
    request: AIModelRequest,
    db : Session = Depends(get_database_mariadb)
):
    try:
        detection_service = ObjectDetectionService(db)
        result = await detection_service.detect_images(request)
        return result
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )