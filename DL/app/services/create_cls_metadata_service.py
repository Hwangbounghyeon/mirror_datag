from fastapi import HTTPException
from configs.mongodb import collection_metadata
from models.mongodb_cls import AiResultData
from datetime import datetime, timezone
import random

BRANCHES = ["Seoul", "Gumi", "Daejeon", "Gwangju", "Busan"]
LOCATIONS = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]
EQUIPMENT_IDS = ["EdgeDevice01", "EdgeDevice02", "EdgeDevice03", "EdgeDevice04", "EdgeDevice05"]
DEPARTMENTS = ["Research and Development", "Production Management", "Production Technology", "Computer", "Quality Control"]

# Classification JSON형식 생성
def create_ai_result_data(
    user: str,
    isPrivate: bool,
    aimodel: str,
    prediction: str,
    confidence: float,
    threshold: float,
    elapsedTime: float
) -> AiResultData:
    
    # 필수 파라미터가 누락되었는지 확인
    required_params = {
        "user": user,
        "isPrivate": isPrivate,
        "aimodel": aimodel,
        "prediction": prediction,
        "confidence": confidence,
        "threshold": threshold,
        "elapsedTime": elapsedTime
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
                "task": "cls",
                "predictions": [
                    {
                        "fileIndex": 0,
                        "prediction": prediction,
                        "confidence": confidence,
                        "threshold": threshold,
                        "inferenceStartedAt": datetime.now(timezone.utc).isoformat(),
                        "elapsedTime": elapsedTime,
                        "tags": [
                            aimodel,
                            "Classfication",
                            prediction,
                            str(datetime.now().year),
                            str(datetime.now().month),
                            branch,
                            location,
                            equipmentId
                        ]
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
        return {"message": "CLS MetaData successfully saved", "id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=500, detail="Failed to save cls metadata")