from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np

# 모델 추론 공통 Request Dto
class DeepLearningModelRequest(BaseModel):
    image_urls: List[str]
    model_type: str
    model_name: str

    model_config = {
        "protected_namespaces": ()
    }

# 모델 추론 공통 Response Dto
class DeepLearningModelResponse(BaseModel):
    pass

# 모델 추론 요청 Dto
class PredictionRequest(BaseModel):
    image_urls: List[str]
    model_name: str

    model_config = {
        "protected_namespaces": ()
    }

# 분류 추론 결과 Dto
class ClassificationPredictionResult(BaseModel):
    used_model: str
    task: str
    predict_class: str
    predict_confidence: float
    features: List[float]
    elapsed_time: float

# 객체탐지 추론 결과 Dto
class ObjectDetectionPredictionResult(BaseModel):
    used_model: str
    task: str
    predict_classes: List[str]
    predict_confidences: List[float]
    features: List[List[float]]
    elapsed_time: float