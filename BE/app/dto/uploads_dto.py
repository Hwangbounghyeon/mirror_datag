from pydantic import BaseModel
from typing import Optional

class UploadRequest(BaseModel):
    project_id: str
    is_private: bool

    model_config = {
        "protected_namespaces": ()
    }