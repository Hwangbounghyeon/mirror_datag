from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from dto.dimension_reduction_dto import DimensionReductionRequest, DimensionReductionResponse
from dto.common_dto import CommonResponse
from configs.mariadb import get_database_mariadb
from services.dimension_reduction_service import DimensionReductionService

router = APIRouter(prefix="/analysis", tags=["analysis with dimension reduction"])

@router.post(
    "", 
    response_model=CommonResponse[DimensionReductionResponse]
)
async def dimension_reduction_umap(
    request: DimensionReductionRequest,
    db: Session = Depends(get_database_mariadb)
):
    try:
        if len(request.image_ids) < 10:
            raise HTTPException(status_code=400, detail="이미지 개수가 부족합니다. (최소 10개)")

        dimension_reduction_service = DimensionReductionService(db)

        results = await dimension_reduction_service.dimension_reduction(request)

        return CommonResponse[DimensionReductionResponse](
            status=200,
            data=results
        )

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))