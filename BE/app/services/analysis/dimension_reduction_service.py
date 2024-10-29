from fastapi import HTTPException
from typing import List
import numpy as np
import time
from sklearn.manifold import TSNE
from sqlalchemy.orm import Session
import umap
from datetime import datetime, timezone
from bson import ObjectId

from dto.dimension_reduction_dto import DimensionReductionRequest, DimensionReductionResponse
from configs.mongodb import collection_histories, collection_features
from models.mongodb_history import HistoryData
from models.mariadb_image import Images
from models.mariadb_users import Histories

class DimensionReductionService:
    def __init__(self, db: Session):
        self.db = db

    async def dimension_reduction(self, request: DimensionReductionRequest) -> DimensionReductionResponse:
        # mariadb 저장
        history_id = self._save_history_mariadb(
            request.user_id,
            request.project_id,
            request.history_name,
            request.is_private,
        )

        # image_ids로 이미지 정보들 가져오기
        image_features = await self._get_image_features(request.image_ids)
        
        # 차원축소 진행
        if request.algorithm == "tsne":
            reduction_features = self._dimension_reduction_TSNE(image_features)
        else:
            reduction_features = self._dimension_reduction_UMAP(image_features)

        # mongodb 저장
        inserted_id = await self._save_history_mongodb(
            "umap",
            request.selected_tags,
            request.image_ids,
            reduction_features
        )
        
        # 작업 완료
        self._update_history_mariadb(history_id, inserted_id)

        return DimensionReductionResponse(
            history_id=history_id,
            project_id=request.project_id,
            user_id=request.user_id,
            history_name=request.history_name,
            history_obj_id=inserted_id
        )

    async def _get_image_features(self, image_ids: List[int]) -> List[List[float]]:
        # IN 절을 사용하여 한 번의 쿼리로 모든 이미지 정보 조회
        images = self.db.query(Images).filter(Images.image_id.in_(image_ids)).all()
        
        if not images:
            raise HTTPException(
                status_code=404,
                detail="No images found with the provided IDs"
            )

        # image_ids의 순서를 유지하기 위한 정렬
        image_dict = {image.image_id: image.feature_id for image in images}
        features = []
        
        # MongoDB에서 feature 데이터 조회
        for image_id in image_ids:
            if image_id in image_dict:
                feature_id = image_dict[image_id]
                feature_doc = await collection_features.find_one(
                    {"_id": ObjectId(feature_id)}
                )
                if feature_doc and "feature" in feature_doc:
                    features.append(feature_doc["feature"])

        return features

    # TSNE 차원축소
    def _dimension_reduction_TSNE(
        self, 
        features: List[List[float]],
        n_components: int = 10,
        perplexity: int = 50
    ) -> List[List[float]]:
        features = self._concatenate_array(features)

        # 최대 50 제한
        perplexity = min(int(np.sqrt(features.shape[0])), perplexity)

        tsne = TSNE(n_components=n_components, verbose=1, perplexity=perplexity, method="exact")

        tsne_result = tsne.fit_transform(features)
        return tsne_result.tolist()

    # umap 차원축소
    def _dimension_reduction_UMAP(
        self,
        features: List[List[float]],
        n_components: int = 10,
        n_neighbors: int = 10
    ) -> List[List[float]]:
        features = self._concatenate_array(features)

        n_neighbors_min = min(n_neighbors, features.shape[0]-1)
        
        umap_reducer = umap.UMAP(n_components=n_components, n_neighbors=n_neighbors_min, init='spectral')

        umap_result = umap_reducer.fit_transform(features)
        return umap_result.tolist()

    # array concatenate
    def _concatenate_array(self, features: List[List[float]]) -> List[List[float]]:
        return np.concatenate(features, axis=0)
        
    # mongodb history object 생성
    def _create_history_mongodb(
        self,
        selected_algorithm: str,
        selected_tags: List[List[str]],
        image_ids: List[int],
        reduction_features: List[List[float]]
    ) -> dict:

        # 필수 파라미터가 누락되었는지 확인
        required_params = {
            "selected_algorithm": selected_algorithm,
            "selected_tags": selected_tags,
            "image_ids": image_ids,
            "reduction_features": reduction_features
        }

        missing_params = [k for k, v in required_params.items() if v is None]
        if missing_params:
            raise ValueError(f"Missing required parameters: {', '.join(missing_params)}")

        history_obj = {
            "parameters": {
                "selectedAlgorithm": selected_algorithm,
                "selectedTags": selected_tags
            },
            "results": {
                "imageIds": image_ids,
                "reductionFeatures": reduction_features
            }
        }   
        
        return history_obj
    
    # 차원축소 기록 저장 (mongodb)
    async def _save_history_mongodb(
        self,
        selected_algorithm: str,
        selected_tags: List[List[str]],
        image_ids: List[int],
        reduction_features: List[List[float]]
    ):
        history_obj = self._create_history_mongodb(selected_algorithm, selected_tags, image_ids, reduction_features)
        result = await collection_histories.insert_one(history_obj)
        if result.inserted_id:
            return str(result.inserted_id)
        else:
            raise HTTPException(status_code=500, detail="Failed to save cls metadata")

    # 차원축소 기록 저장 (mariadb)
    def _save_history_mariadb(
        self,
        user_id: int,
        project_id: int,
        history_name: str,
        is_private: bool,
    ) -> int:
        history = Histories(
            user_id=user_id,
            project_id=project_id,
            history_name=history_name,
            history_obj_id=None,
            is_private=is_private,
            is_done=False,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        
        return history.history_id

    # 차원축소 완료 저장 (mariadb)
    def _update_history_mariadb(
        self,
        history_id: int,
        history_obj_id: str
    ) -> None:
        history = self.db.query(Histories).filter(Histories.history_id == history_id).first()
        if not history:
            raise HTTPException(
                status_code=404,
                detail="History not found"
            )
        
        history.history_obj_id = history_obj_id
        history.is_done = True
        history.updated_at = datetime.now(timezone.utc)
        self.db.commit()