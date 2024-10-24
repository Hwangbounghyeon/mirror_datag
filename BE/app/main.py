from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from configs.mariadb import get_db
app = FastAPI()


# DB 연결 확인 엔드포인트
@app.get("/check-db-connection")
async def check_db_connection(db: sessionmaker = Depends(get_db)):
    try:
        # 간단한 쿼리 실행 (MariaDB 연결 확인)
        result = db.execute(text("SELECT 1"))
        return {"status": "connected", "result": result.fetchone()[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")