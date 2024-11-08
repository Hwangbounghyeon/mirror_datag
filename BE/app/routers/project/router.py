from fastapi import APIRouter
from routers.project.base_router import router as base_router
from routers.project.history_router import router as history_router
from routers.project.analysis_router import router as analysis_router

router = APIRouter(prefix="/project", tags=["Project"])

router.include_router(base_router)
router.include_router(history_router)
router.include_router(analysis_router)