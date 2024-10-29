from pydantic import BaseModel

class UploadBase(BaseModel):
    user_id: int
    task: str
    model_name: str
    project_id: int
    is_private: bool

    model_config = {
        "protected_namespaces": ()
    }