from pydantic import BaseModel
from typing import Optional

class UploadRequest(BaseModel):
    user_id: int
    department_id: Optional[int] = None
    task: str
    model_name: str
    project_id: str
    is_private: bool

    model_config = {
        "protected_namespaces": ()
    }