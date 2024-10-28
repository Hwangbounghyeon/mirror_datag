from fastapi import FastAPI
from typing import Optional

from routers import cls_router, det_router

app = FastAPI()

app.include_router(cls_router.router)
app.include_router(det_router.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}