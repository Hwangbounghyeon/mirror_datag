from fastapi import APIRouter, HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session


from services.search_service import TagService
from dto.search_dto import TagImageResponse, SearchRequest, ImageSearchResponse
from dto.common_dto import CommonResponse
from configs.mariadb import get_database_mariadb as get_db
from services.user_service import JWTManage

security_scheme = HTTPBearer()

router = APIRouter(prefix="/search", tags=["search"])

@router.get("", response_model=CommonResponse[TagImageResponse])
async def get_tags_and_images(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme), 
    db: Session = Depends(get_db)):
    try:
        tag_service = TagService(db)
        result = await tag_service.get_tag_and_image_lists()
        return CommonResponse(status=200, data=result)
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/image", response_model=CommonResponse[ImageSearchResponse])
async def search_images(
    condition_data: SearchRequest,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_db)
):
    try:
        jwt = JWTManage(db)
        user_id = jwt.verify_token(credentials.credentials)["user_id"]
        
        tag_service = TagService(db)
        result = await tag_service.search_images_by_conditions(condition_data.conditions, user_id)
        
        return CommonResponse(
            status=200,
            data=result
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
@router.get("/project/{project_id}/images", response_model=CommonResponse[ImageSearchResponse])
async def search_project_images(
    project_id: str,
    search_request: SearchRequest,
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_db)
):
    try:
        jwt = JWTManage(db)
        user_id = jwt.verify_token(credentials.credentials)["user_id"]
        
        tag_service = TagService(db)
        result = await tag_service.search_project_images(project_id, search_request.conditions, user_id)
        return CommonResponse(
            status=200, data=result
            )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))