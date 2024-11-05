import logging
import platform
import uuid
from configs.mongodb import mongo_url
from configs.mariadb import get_database_mariadb
from configs.s3 import upload_to_s3
from configs.mongodb import get_database_mongodb
from contextlib import asynccontextmanager
from routers.analysis_router import router as analysis_router
from routers.uploads_router import router as upload_router
from routers.users_router import router as users_router
from routers.project_router import router as project_router
from routers.download_router import router as download_router
# from routers.tags_router import router as tags_router
from routers.image_detail_router import router as image_detail_router
from routers.history_router import router as history_router
from routers.search_router import router as search_router

import asyncio
from fastapi import FastAPI, APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import sessionmaker

if platform.system() == 'Windows':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI()


main_router = APIRouter(prefix="/be/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins = [mongo_url, "*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

main_router.include_router(analysis_router)
main_router.include_router(upload_router)
main_router.include_router(users_router)
main_router.include_router(project_router)
main_router.include_router(download_router)
# main_router.include_router(tags_router)
main_router.include_router(image_detail_router)
main_router.include_router(history_router)
main_router.include_router(search_router)

app.include_router(main_router)

@asynccontextmanager
async def startup_db_client(app: FastAPI):
    get_database_mongodb()
    get_database_mariadb()
    yield


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# DB 연결 확인 엔드포인트
@app.get("/check-db-connection")
async def check_db_connection_mariadb(db: sessionmaker = Depends(get_database_mariadb)):
    try:
        # 간단한 쿼리 실행 (MariaDB 연결 확인)
        result = db.execute(text("SELECT 1"))
        return {"status": "connected", "result": result.fetchone()[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")
    
# S3 연결 확인 엔드포인트
@app.post("/check-s3-connection")
async def check_db_connection_s3(file: UploadFile | None = File(None)):
    if not file:
        return {"image not found"}
    
    s3_filename = f"{uuid.uuid4()}.jpg"
    bucket_name = 'ssafy-project'
    upload_to_s3(file.file, bucket_name, s3_filename)
    
    s3_url = f"https://{bucket_name}.s3.us-east-2.amazonaws.com/{s3_filename}"

    return {"image_url" : s3_url}