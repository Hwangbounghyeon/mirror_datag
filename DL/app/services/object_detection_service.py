from fastapi import HTTPException
from typing import List
from ultralytics import YOLO
import torch
from PIL import Image
from PIL.Image import Image as PILImage
from io import BytesIO
import numpy as np
import torch.nn as nn
import time

from dto.model_dto import PredictionRequest, ObjectDetectionPredictionResult
from services.database_service import DatabaseService
from services.preprocess_service import PreprocessService

YOLOModel = type[YOLO]

class ObjectDetectionService:
    def __init__(self, database_service: DatabaseService, preprocess_service: PreprocessService):
        self.database_service = database_service
        self.preprocess_service = preprocess_service
        self.model_list = ["yolov5n", "yolov8n", "yolo11n"]
        self.features = None
        self.conf_threshold = 0.7

    # 객체 탐지 실행 (나중에 반환타입 명시하기)
    def detect_images(self, request: PredictionRequest):
        try:
            # 모델리스트에 없으면 에러
            if request.model_name not in self.model_list:
                raise HTTPException(
                    status_code=400, 
                    detail="Detection Model Not Found"
                )

            model = self._set_model_YOLO(request.model_name)

            temp_result = []

            for url in request.image_urls:
                image_data = self.preprocess_service.load_image_from_s3(url)
                image_data = Image.open(BytesIO(image_data))
                image_tensor = self.preprocess_service.process_image(image_data, (640, 640))

                model_prediction_result = self._predict_model_YOLO(model, request.model_name, image_tensor)

                if model_prediction_result is None:
                    continue

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
    def _set_model_YOLO(self, model_name: str) -> YOLOModel:
        model = YOLO(f"{model_name}.pt")
        model.verbose = False

        def hook_fn(module, input, output):
            self.features = output

        model.model.model[-2].register_forward_hook(hook_fn)
        return model

    # 모델 예측
    def _predict_model_YOLO(self, model: YOLOModel, model_name: str, image_tensor: torch.Tensor) -> ObjectDetectionPredictionResult:
        labels = []
        confidences = []
        features = []
        try:
            # 시작 시간
            start_time = time.time()

            results = model(image_tensor, conf=self.conf_threshold, verbose=False)

            if isinstance(results, list):
                results = results[0]

            boxes = results.boxes
            orig_img = results.orig_img

            class_names = results.names

            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                
                cls = int(box.cls)
                class_name = class_names[cls] if cls in class_names else f"Class {cls}"
                
                if class_name not in ['cat', 'truck', 'car', 'dog', 'bird']:
                    continue

                conf = float(box.conf)
                
                confidences.append(conf)

                cropped_obj = orig_img[y1:y2, x1:x2]

                image_converted = Image.fromarray(cropped_obj)

                input_data = self.preprocess_service.process_image(image_converted, (640, 640))

                output = model(input_data)
                
                global_avg_pool = nn.AdaptiveAvgPool2d((1, 1))
                output_global = global_avg_pool(self.features)    

                features.append(output_global.view((self.features.size(0), -1)))
                labels.append(class_name)

            # 종료 시간
            end_time = time.time()
            # 실행 시간 계산
            elapsed_time = end_time - start_time

            if len(features) > 0:
                all_features = np.concatenate(features, axis=0)
            else:
                return None

            model_results = {
                "used_model": model_name,
                "task": "det",
                "threshold": self.conf_threshold,
                "predict_classes": labels,
                "predict_confidences": confidences,
                "features": all_features.tolist(),
                "elapsed_time": elapsed_time
            }
            return ObjectDetectionPredictionResult(**model_results)

        except Exception as e:
            raise HTTPException(
                status_code=400, 
                detail=f"Detection failed: {str(e)}"
            )