from fastapi import APIRouter, Depends, HTTPException
from typing import List

from dto.ai_model_dto import AIModelRequest
from services.ai_model.classification_service import ClassificationService
from configs.mariadb import get_database_mariadb
from sqlalchemy.orm import Session

router = APIRouter(prefix="/cls", tags=["classification"])

@router.post("/")
async def classify_objects(
    request: AIModelRequest,
    db : Session = Depends(get_database_mariadb)
):
    try:
        classification_service = ClassificationService(db)
        result = await classification_service.classify_images(request)
        return result
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )