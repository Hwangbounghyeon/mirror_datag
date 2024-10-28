from fastapi import APIRouter, Depends, HTTPException
from typing import List

from dto.ai_model_dto import AIModelRequest
from services.ai_model.classification_service import ClassificationService

router = APIRouter(prefix="/cls", tags=["classification"])

# 의존성 주입
def get_classification_service():
    return ClassificationService()

@router.post("/")
async def classify_objects(
    request: AIModelRequest,
    classification_service: ClassificationService = Depends(get_classification_service)
):
    try:
        result = await classification_service.classify_images(request)
        return result
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )