from fastapi import APIRouter, Depends, HTTPException
from typing import List

from dto.ai_model_dto import AIModelRequest
from services.ai_model.detection_service import ObjectDetectionService

router = APIRouter(prefix="/det", tags=["object_detection"])

# 의존성 주입
def get_object_detection_service():
    return ObjectDetectionService()

@router.post("/")
async def detect_objects(
    request: AIModelRequest,
    detection_service: ObjectDetectionService = Depends(get_object_detection_service)
):
    try:
        result = await detection_service.detect_images(request)
        return result
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )