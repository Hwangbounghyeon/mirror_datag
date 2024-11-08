from fastapi import HTTPException
from typing import List
import numpy as np
import time
from sklearn.manifold import TSNE
from sqlalchemy.orm import Session
import umap
from datetime import datetime, timezone
from bson import ObjectId

from dto.analysis_dto import DimensionReductionRequest, DimensionReductionResponse
from configs.mongodb import collection_histories, collection_features, collection_project_histories, collection_images, collection_metadata
from models.history_models import HistoryData, ReductionResults

class AnalysisService:
    def __init__(self, db: Session):
        self.db = db

    async def dimension_reduction(self, request: DimensionReductionRequest, user_id: int) -> DimensionReductionResponse:
        # mongodb 저장
        inserted_id = await self._save_history_mongodb(
            user_id,
            request.project_id,
            request.is_private,
            request.history_name,
            request.algorithm,
            request.selected_tags,
        )

        await self._mapping_project_histories_mongodb(request.project_id, inserted_id)

        # image_ids로 이미지 정보들 가져오기
        image_features = await self._get_image_features(request.image_ids)

        concat_image_infos = []
        for i in range(len(image_features)):
            image_info = await collection_images.find_one({"_id": ObjectId(request.image_ids[i])})
            image_metadata = await collection_metadata.find_one({"_id": ObjectId(image_info.get("metadataId"))})

            ai_results = image_metadata["aiResults"][0]
            predictions = ai_results["predictions"][0]
            
            # feature의 클래스 수만큼 반복
            if ai_results["task"] == "det":
                for j in range(len(image_features[i])):  # 클래스 수만큼 반복
                    concat_image_infos.append({
                        "imageId": request.image_ids[i],
                        "predictions": predictions["detections"][j],
                        "imageUrl": image_metadata["fileList"][0]
                    })
            else:
                for j in range(len(image_features[i])):  # 클래스 수만큼 반복
                    concat_image_infos.append({
                        "imageId": request.image_ids[i],
                        "predictions": {
                            "prediction": predictions["prediction"],
                            "confidence": predictions["confidence"]
                        },
                        "imageUrl": image_metadata["fileList"][0]
                    })
                    
        # features concatenate
        concat_features = self._concatenate_array(image_features)
        
        # 차원축소 진행
        if request.algorithm == "tsne":
            reduction_features = self._dimension_reduction_TSNE(concat_features)
        else:
            reduction_features = self._dimension_reduction_UMAP(concat_features)

        for i in range(len(concat_image_infos)):
            concat_image_infos[i]["features"] = reduction_features[i]

        # 작업 완료
        await self._save_history_completed_mongodb(request.project_id, inserted_id, concat_image_infos)

        return DimensionReductionResponse(
            history_id=inserted_id,
            project_id=request.project_id,
            user_id=user_id,
            history_name=request.history_name
        )

    async def _get_image_features(self, image_ids: List[str]) -> List[List[float]]:
        # IN 절을 사용하여 한 번의 쿼리로 모든 이미지 정보 조회
        images = await collection_images.find(
            {"_id": {"$in": [ObjectId(id) for id in image_ids]}}
        ).to_list(length=None)

        if not images:
            raise HTTPException(
                status_code=404,
                detail="No images found with the provided IDs"
            )
        
        # image_ids의 순서를 유지하기 위한 딕셔너리 생성
        image_dict = {str(image["_id"]): image["featureId"] for image in images}
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
        features: np.ndarray,
        n_components: int = 10,
        perplexity: int = 50
    ) -> List[List[float]]:
        # 최대 50 제한
        perplexity = min(int(np.sqrt(features.shape[0])), perplexity)

        tsne = TSNE(n_components=n_components, verbose=1, perplexity=perplexity, method="exact")

        tsne_result = tsne.fit_transform(features)
        return tsne_result.tolist()

    # umap 차원축소
    def _dimension_reduction_UMAP(
        self,
        features: np.ndarray,
        n_components: int = 10,
        n_neighbors: int = 10
    ) -> List[List[float]]:
        n_neighbors_min = min(n_neighbors, features.shape[0]-1)
        
        umap_reducer = umap.UMAP(
            n_components=n_components, 
            n_neighbors=n_neighbors_min, 
            init='random',
            n_jobs=1
        )

        umap_result = umap_reducer.fit_transform(features)
        return umap_result.tolist()

    # array concatenate
    def _concatenate_array(self, features: List[List[float]]) -> np.ndarray:
        return np.concatenate(features, axis=0)
        
    # mongodb history object 생성
    def _create_history_mongodb(
        self,
        userId: int,
        projectId: str,
        is_private: bool,
        history_name: str,
        selected_algorithm: str,
        selected_tags: List[List[str]],
    ) -> HistoryData:

        # 필수 파라미터가 누락되었는지 확인
        required_params = {
            "userId": userId,
            "projectId": projectId,
            "selected_algorithm": selected_algorithm,
            "selected_tags": selected_tags,
            "is_private": is_private,
            "history_name": history_name
        }

        missing_params = [k for k, v in required_params.items() if v is None]
        if missing_params:
            raise ValueError(f"Missing required parameters: {', '.join(missing_params)}")

        history_obj = {
            "userId": userId,
            "projectId": projectId,
            "isPrivate": is_private,
            "historyName": history_name,
            "isDone": False,
            "parameters": {
                "selectedAlgorithm": selected_algorithm,
                "selectedTags": selected_tags
            },
            "results": None,
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc)
        }   
        
        return HistoryData.model_validate(history_obj)
    
    # 차원축소 기록 저장 (mongodb)
    async def _save_history_mongodb(
        self,
        userId: int,
        projectId: str,
        is_private: bool,
        history_name: str,
        selected_algorithm: str,
        selected_tags: List[List[str]],
    ):
        try:
            history_obj = self._create_history_mongodb(
                userId,
                projectId,
                is_private,
                history_name,
                selected_algorithm, 
                selected_tags
            )
            result = await collection_histories.insert_one(history_obj.model_dump())

            if result.inserted_id:
                return str(result.inserted_id)
            else:
                raise HTTPException(status_code=500, detail="Failed to save cls metadata")
        except Exception as e:
            raise Exception(f"Failed to update results: {str(e)}")


    # 차원축소 기록 완료 저장 (mongodb)
    async def _save_history_completed_mongodb(
        self,
        project_id: str,
        history_id: str,
        image_infos: List[ReductionResults]
    ):
        try:
            document = await collection_histories.find_one({"_id": ObjectId(history_id)})
            if not document:
                raise Exception(f"Document with id {history_id} not found")
            
            update_data = {
                "results": image_infos,
                "isDone": True,
                "updatedAt": datetime.now(timezone.utc)
            }

            await collection_histories.update_one(
                {"_id": ObjectId(history_id)},  # ID로 문서 찾기
                {"$set": update_data}
            )

        except Exception as e:
            raise Exception(f"Failed to update results: {str(e)}")

    async def _mapping_project_histories_mongodb(self, project_id: str, history_id: str):
        try:
            # 기존 document 확인
            existing_doc = await collection_project_histories.find_one()

            # 문서가 없을 경우 새로운 문서 생성
            if existing_doc is None:
                new_document = {
                    "project": {}
                }
                await collection_project_histories.insert_one(new_document)

            # 업데이트 수행
            await collection_project_histories.update_one(
                {},
                {
                    "$addToSet": {
                        f"project.{str(project_id)}": history_id
                    }
                }
            )
        except Exception as e:
            raise Exception(f"Failed to update results: {str(e)}")
