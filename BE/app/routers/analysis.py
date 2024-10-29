from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from dto.dimension_reduction_dto import DimensionReductionRequest, DimensionReductionResponse
from dto.common_dto import CommonResponse, ErrorResponse
from configs.mariadb import get_database_mariadb
from services.analysis.dimension_reduction_service import DimensionReductionService

router = APIRouter(prefix="/analysis", tags=["analysis with dimension reduction"])

@router.post(
    "", 
    response_model=CommonResponse[DimensionReductionResponse],
    responses={
        400: {"model": CommonResponse[ErrorResponse]},
        500: {"model": CommonResponse[ErrorResponse]}
    })
async def dimension_reduction_umap(
    request: DimensionReductionRequest,
    db: Session = Depends(get_database_mariadb)
):
    try:
        if len(request.image_ids) < 10:
            return CommonResponse[ErrorResponse](
                status=400,
                error=ErrorResponse(
                    code="INSUFFICIENT_DATA",
                    message="이미지 개수 부족",
                    detail="차원 축소를 위해서는 최소 10개 이상의 이미지가 필요합니다."
                )
            )

        dimension_reduction_service = DimensionReductionService(db)

        results = await dimension_reduction_service.dimension_reduction(request)

        return CommonResponse[DimensionReductionResponse](
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