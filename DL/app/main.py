from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from routers import cls_router, det_router
from services.mongodb.create_cls_metadata_service import Create_cls_metadata
from configs.mongodb import mongo_url
import traceback
from configs.mongodb import get_database_mongodb

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = [mongo_url],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(cls_router.router)
app.include_router(det_router.router)

@app.on_event("startup")
async def startup_db_client():
    get_database_mongodb()
        
@app.post("/upload-ai-result")
async def upload_ai_result_endpoint(
    user: str,
    isPrivate: bool,
    aimodel: str,
    prediction: str,
    confidence: float,
    threshold: float,
    elapsedTime: float
):
    try:
        # ai_result_data 생성
        ai_result_data = Create_cls_metadata.create_ai_result_data(user, isPrivate, aimodel, prediction, confidence, threshold, elapsedTime)
        
        # MongoDB에 데이터 업로드
        response = await Create_cls_metadata.upload_ai_result(ai_result_data)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An error occurred while saving data")
