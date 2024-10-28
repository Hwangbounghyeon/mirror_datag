from fastapi import HTTPException
from configs.mongodb import collection_metadata
from models.mongodb_det import AiResultData
from datetime import datetime, timezone
import random


BRANCHES = ["Seoul", "Gumi", "Daejeon", "Gwangju", "Busan"]
LOCATIONS = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]
EQUIPMENT_IDS = ["EdgeDevice01", "EdgeDevice02", "EdgeDevice03", "EdgeDevice04", "EdgeDevice05"]
DEPARTMENTS = ["Research and Development", "Production Management", "Production Technology", "Computer", "Quality Control"]

"""
detection_data 형식 예시

detection_data = [
        {"prediction": "Dog", "confidence": 0.95, "threshold": 0.8, "bbox": [169, 55, 235, 94]},
        {"prediction": "Cat", "confidence": 0.98, "threshold": 0.8, "bbox": [168, 252, 234, 293]}
    ]
"""


# Object Detection JSON형식 생성
def create_ai_result_data_with_detections(
    user: str,
    isPrivate: bool,
    aimodel: str,
    elapsedTime: float,
    detection_data: list
) -> AiResultData:
    
    # 필수 파라미터가 누락되었는지 확인
    required_params = {
        "user": user,
        "isPrivate": isPrivate,
        "aimodel": aimodel,
        "elapsedTime": elapsedTime,
        "detection_data": detection_data
    }
    missing_params = [k for k, v in required_params.items() if v is None]
    if missing_params:
        raise ValueError(f"Missing required parameters: {', '.join(missing_params)}")
    
    branch = random.choice(BRANCHES)
    location = random.choice(LOCATIONS)
    equipmentId = random.choice(EQUIPMENT_IDS)

    ai_result_data = {
        "schemaVersion": "1.0",
        "fileList": ["/Object/Storage/Data/Url"],
        "metadata": {
            "branch": branch,
            "process": "Manufacturing",
            "location": location,
            "equipmentId": equipmentId,
            "uploader": user,
            "isPrivate": isPrivate,
            "accessControl": {
                "users": [user],
                "departments": ["gumi", "seoul"],
                "projects": []
            },
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "mode": "upload"
        },
        "aiResults": [
            {
                "aiModel": aimodel,
                "task": "det",
                "predictions": [
                    {
                        "fileIndex": 0,
                        "detections": [
                            {
                                "prediction": detection["prediction"],
                                "confidence": detection["confidence"],
                                "threshold": detection["threshold"],
                                "bbox": detection["bbox"]
                            } for detection in detection_data
                        ],
                        "inferenceStartedAt": datetime.now(timezone.utc).isoformat(),
                        "elapsedTime": elapsedTime,
                        "tags": [
                            aimodel,
                            "Object Detection",
                            str(datetime.now().year),
                            str(datetime.now().month),
                            branch,
                            location,
                            equipmentId
                        ] + [detection["prediction"] for detection in detection_data]
                    }
                ]
            }
        ]
    }

    return AiResultData.parse_obj(ai_result_data)

# MongoDB 업로드
async def upload_ai_result(ai_result_data: AiResultData):
    ai_result_dict = ai_result_data.dict() 
    result = await collection_metadata.insert_one(ai_result_dict)
    if result.inserted_id:
        return {"message": "DET MetaData successfully saved", "id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=500, detail="Failed to save det metadata")