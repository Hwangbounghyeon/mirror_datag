from fastapi import APIRouter, Depends, HTTPException
from typing import List

from dto.model_dto import PredictionRequest
from services.classification_service import ClassificationService
from services.database_service import DatabaseService
from services.preprocess_service import PreprocessService

router = APIRouter(prefix="/cls", tags=["classification"])

# 의존성 주입
def get_classification_service():
    database_service = DatabaseService()
    preprocess_service = PreprocessService()
    return ClassificationService(database_service, preprocess_service)

@router.get("/")
def get_routes():
    return {"Hello": "cls"}

@router.post("/")
async def classify_objects(
    request: PredictionRequest,
    classification_service: ClassificationService = Depends(get_classification_service)
):
    """
    Classification endpoint
    
    Args:
        request (ModelPredictionRequest): Contains model_name and image_urls
        classification_service (ClassificationService): Injected classification service
    
    Returns:
        ModelPredictionResult: Classification results including labels, confidences and features
    """
    try:
        result = classification_service.classify_images(request)
        return result
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )