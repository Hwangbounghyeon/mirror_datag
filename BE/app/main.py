from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from configs.mariadb import get_database_mariadb
from configs.s3 import upload_to_s3
import uuid

app = FastAPI()


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