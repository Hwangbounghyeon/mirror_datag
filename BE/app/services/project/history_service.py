from fastapi import HTTPException
from typing import List
import numpy as np
import time
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from bson import ObjectId

from dto.pagination_dto import PaginationDto
from dto.history_dto import HistoryListResponse, HistoryListData
from configs.mongodb import collection_histories, collection_project_histories
from models.history_models import HistoryData, ReductionResults

class HistoryService:
    def __init__(self, db: Session):
        self.db = db
    
    async def get_histories(self, project_id: str, user_id: int, page: int = 1, limit: int = 10) -> PaginationDto[List[HistoryListData]]:
        try:
            project_histories = await collection_project_histories.find_one({})
            if not project_histories or "project" not in project_histories:
                return {
                    "data": [],
                    "page": page,
                    "limit": limit,
                    "total_count": 0,
                    "total_pages": page
                }
            
            project_history_ids = project_histories["project"].get(project_id, [])
            if not project_history_ids:
                return {
                    "data": [],
                    "page": page,
                    "limit": limit,
                    "total_count": 0,
                    "total_pages": page
                }

            history_object_ids = [ObjectId(hid) for hid in project_history_ids]

            base_query = {
                "_id": {"$in": history_object_ids},
                "$or": [
                    {"isPrivate": False},
                    {"$and": [
                        {"isPrivate": True},
                        {"userId": user_id}
                    ]}
                ]
            }

            skip = (page - 1) * limit
            
            total_histories = await collection_histories.count_documents(base_query)
            total_pages = (total_histories + limit - 1) // limit

            histories = await collection_histories.find(base_query).skip(skip).limit(limit).to_list(length=limit)

            return_value = [
                HistoryListData(
                    history_id=str(history["_id"]),
                    history_name=history["historyName"],
                    is_done=history["isDone"],
                    created_at=history["createdAt"],
                    updated_at=history["updatedAt"]
                )
                for history in histories
            ]

            return {
                "data": return_value,
                "page": page,
                "limit": limit,
                "total_count": total_histories,
                "total_pages": total_pages
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    async def get_history_detail(self, history_id: str) -> HistoryData:
        try:
            history = await collection_histories.find_one({"_id": ObjectId(history_id)})
            
            if not history:
                raise HTTPException(status_code=404, detail=f"History with id {history_id} not found")

            history["_id"] = str(history["_id"])
                
            return {**history}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
