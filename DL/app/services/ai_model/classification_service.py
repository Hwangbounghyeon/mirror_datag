from fastapi import HTTPException
from typing import List
import torch
import torch.nn as nn
from PIL import Image
from PIL.Image import Image as PILImage
from io import BytesIO
import numpy as np
import torch.nn as nn
import time

from dto.ai_model_dto import AIModelRequest, ClassificationPredictionResult
from models.mongodb_cls import AiResultData
from services.ai_model.preprocess_service import PreprocessService
from services.mongodb.classification_metadata_service import ClassificationMetadataService
from services.mariadb.image_service import ImageService

CIFAR10_CLASSES = ['plane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']

class ClassificationService:
    def __init__(self):
        self.preprocess_service = PreprocessService()
        self.classification_metadata_service = ClassificationMetadataService()
        self.image_service = ImageService()
        self.model_list = ["vgg19_bn", "mobilenetv2_x1_4", "repvgg_a2"]
        self.features = None
        self.conf_threshold = 0.7

    async def classify_images(self, request: AIModelRequest):
        try:
            # 모델리스트에 없으면 에러
            if request.model_name == "vgg19_bn":
                model = self._set_model_vgg19_bn(request.model_name)
            elif request.model_name == "mobilenetv2_x1_4":
                model = self._set_model_mobilenetv2_x1_4(request.model_name)
            elif request.model_name == "repvgg_a2":
                model = self._set_model_repvgg_a2(request.model_name)
            else:
                raise HTTPException(
                    status_code=400, 
                    detail="Classification Model Not Found"
                )

            temp_result = []

            for url in request.image_urls:
                image_data = self.preprocess_service.load_image_from_s3(url)
                image_data = Image.open(BytesIO(image_data))
                image_tensor = self.preprocess_service.process_image(image_data, (32, 32), use_normalize=True)

                model_prediction_result = self._predict_model_CNN(model, request.model_name, image_tensor)

                if model_prediction_result is None:
                    continue

                metadata = self.classification_metadata_service.create_classification_result_data(
                    request.user_id,
                    request.is_private,
                    model_prediction_result.used_model,
                    model_prediction_result.predict_class,
                    model_prediction_result.predict_confidence,
                    model_prediction_result.elapsed_time
                )
                
                metadata_id = await self.classification_metadata_service.upload_ai_result(metadata)

                features = self.classification_metadata_service.create_feature(model_prediction_result.features)

                features_id = await self.classification_metadata_service.upload_feature(features)

                image_id = await self.image_service.create_image(metadata_id, features_id)

                tag_ids = await self.image_service.create_tags(metadata.aiResults[0].predictions[0].tags)

                await self.image_service.create_image_tags(image_id, tag_ids)

                await self.image_service.create_project_image(request.project_id, image_id)
                
                print(metadata_id, features_id)

                # 메타데이터 및 DB 저장로직이 이후에 들어오면됨
                temp_result.append(model_prediction_result)

            # 저장 끝나면 api 반환 dto에 맞게 객체 생성후 반환
            return temp_result

        except Exception as e:
            raise HTTPException(
                status_code=400, 
                detail=f"Detection failed: {str(e)}"
            )

    # 모델 정의
    def _set_model_vgg19_bn(self, model_name: str) -> torch.nn.Module:
        model = torch.hub.load("chenyaofo/pytorch-cifar-models", f"cifar10_{model_name}", pretrained=True)
        model.verbose = False

        def hook_fn(module, input, output):
            self.features = output
            
        model.features[-1].register_forward_hook(hook_fn)
        return model

    # 모델 정의
    def _set_model_mobilenetv2_x1_4(self, model_name: str) -> torch.nn.Module:
        model = torch.hub.load("chenyaofo/pytorch-cifar-models", f"cifar10_{model_name}", pretrained=True)
        model.verbose = False

        def hook_fn(module, input, output):
            self.features = output

        model.features[-1].register_forward_hook(hook_fn)
        return model

    # 모델 정의
    def _set_model_repvgg_a2(self, model_name: str) -> torch.nn.Module:
        model = torch.hub.load("chenyaofo/pytorch-cifar-models", f"cifar10_{model_name}", pretrained=True)
        model.verbose = False

        def hook_fn(module, input, output):
            self.features = output

        model.gap.register_forward_hook(hook_fn)
        return model

    # 모델 예측
    def _predict_model_CNN(self, model: torch.nn.Module, model_name: str, image_tensor: torch.Tensor) -> ClassificationPredictionResult:
        try:
            # features 초기화
            self.features = None
            # 시작 시간
            start_time = time.time()

            model.eval()

            with torch.no_grad():
                output = model(image_tensor)
                # 가장 높은 확률값과 해당 클래스 인덱스 추출
                conf, predicted_class = torch.max(output, dim=1)

            # 종료 시간
            end_time = time.time()
            # 실행 시간 계산
            elapsed_time = end_time - start_time

            model_results = {
                "used_model": model_name,
                "predict_class": CIFAR10_CLASSES[int(predicted_class.item())],
                "predict_confidence": float(conf.item()) * 0.1,
                "features": self.features.view(self.features.size(0), -1).tolist(),
                "elapsed_time": elapsed_time
            }
            return ClassificationPredictionResult(**model_results)

        except Exception as e:
            raise HTTPException(
                status_code=400, 
                detail=f"Detection failed: {str(e)}"
            )