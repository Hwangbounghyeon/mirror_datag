from fastapi import HTTPException
from configs.mongodb import collection_features
from models.mongodb_feature import Feature
import datetime, timezone

# Feature JSON형식 생성
def create_feature(
    feature: list
) -> Feature:

    data = {
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "feature" : feature
    }
    
    return Feature.parse_obj(data)


# MongoDB 업로드
async def upload_feature(feature: Feature):
    feature_dict = feature.dict() 
    result = await collection_features.insert_one(feature_dict)
    if result.inserted_id:
        return {"message": "Feature successfully saved", "id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=500, detail="Failed to save Feature")