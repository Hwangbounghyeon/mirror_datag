from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from sqlalchemy.orm import Session

from dto.analysis_dto import DimensionReductionRequest, DimensionReductionResponse
from dto.common_dto import CommonResponse
from configs.mariadb import get_database_mariadb
from services.user_service import JWTManage
from services.analysis_service import AnalysisService

security_scheme = HTTPBearer()

router = APIRouter(prefix="/analysis", tags=["analysis with dimension reduction"])

@router.post("", response_model=CommonResponse[DimensionReductionResponse])
async def dimension_reduction_umap(
    request: DimensionReductionRequest,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        if len(request.image_ids) < 10:
            raise HTTPException(status_code=400, detail="이미지 개수가 부족합니다. (최소 10개)")

        access_token = credentials.credentials
        jwt = JWTManage(db)
        user_id = jwt.verify_token(access_token)["user_id"]

        analysis_service = AnalysisService(db)
        results = await analysis_service.dimension_reduction(request, user_id)
        return CommonResponse[DimensionReductionResponse](
            status=200,
            data=results
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))