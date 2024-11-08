from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from sqlalchemy.orm import Session

from configs.mariadb import get_database_mariadb
from dto.common_dto import CommonResponse
from services.department.department_service import DepartmentService

security_scheme = HTTPBearer()

# 회원 및 인증 관련이므로 auth로 묶음
router = APIRouter(prefix="/department", tags=["Department"])

# 4. 부서 리스트 조회
@router.get("/list")
async def get_department_list(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_database_mariadb)
):
    try:
        department_service = DepartmentService(db)
        departments = await department_service.get_department_list()
        return CommonResponse(
            status=200,
            data=departments
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))