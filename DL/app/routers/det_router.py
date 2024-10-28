from fastapi import APIRouter, Depends, HTTPException
from typing import List

from dto.model_dto import PredictionRequest
from services.object_detection_service import ObjectDetectionService
from services.database_service import DatabaseService
from services.preprocess_service import PreprocessService

router = APIRouter(prefix="/det", tags=["object_detection"])

# 의존성 주입
def get_object_detection_service():
    database_service = DatabaseService()
    preprocess_service = PreprocessService()
    return ObjectDetectionService(database_service, preprocess_service)

@router.get("/")
def get_routes():
    return {"Hello": "det"}

@router.post("/")
async def detect_objects(
    request: PredictionRequest,
    detection_service: ObjectDetectionService = Depends(get_object_detection_service)
):
    """
    Object detection endpoint
    
    Args:
        request (ModelPredictionRequest): Contains model_name and image_urls
        detection_service (ObjectDetectionService): Injected detection service
    
    Returns:
        ModelPredictionResult: Detection results including labels, confidences and features
    """
    try:
        result = detection_service.detect_images(request)
        return result
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )