from fastapi import  HTTPException
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from typing import List
import mimetypes
import zipfile
import requests
import uuid
import io
import os
import json
from bson import ObjectId

from configs.mongodb import collection_upload_batches, collection_user_upload_batches
from models.uploadbatch_models import UploadBatch
from models.mariadb_users import Departments
from dto.uploads_dto import UploadRequest
from configs.s3 import upload_to_s3

BUCKENAME = 'ssafy-project'

class Upload:
    def __init__(self, db : Session):
        self.db = db

    def is_image(self, filename : str):
        mime_type, _ = mimetypes.guess_type(filename)
        return mimetypes is not None and mime_type.startswith("image")

    # 메인 로직
    async def upload_image(self, upload_request: UploadRequest, files: list):

        inserted_id = await self._before_save_upload_batch(upload_request)

        await self._mapping_user_upload_batches(upload_request.project_id, upload_request.user_id, inserted_id)

        file_urls = await self._upload_s3(files)

        await self._analysis_data(upload_request, file_urls)

        await self._after_save_upload_batch(inserted_id)

        return file_urls
        
    async def _before_save_upload_batch(self, upload_request: UploadRequest) -> str:
        try:
            batch_obj = {
                "userId": upload_request.user_id,
                "projectId": upload_request.project_id,
                "isDone": False,
                "createdAt": datetime.now(timezone.utc),
                "updatedAt": datetime.now(timezone.utc)
            }

            batch_obj = UploadBatch.model_validate(batch_obj)

            result = await collection_upload_batches.insert_one(batch_obj.model_dump())

            if result.inserted_id:
                return str(result.inserted_id)
            else:
                raise HTTPException(status_code=500, detail="Failed to save cls metadata")
        except Exception as e:
            raise Exception(f"Failed to update results: {str(e)}")

    async def _upload_s3(self, files: list) -> List[str]:
        file_urls = []

        for file in files:
            if file.filename.endswith("zip"):
                contents = await file.read()

                try:
                    with zipfile.ZipFile(io.BytesIO(contents)) as zip_file:
                        extracted_files = zip_file.namelist()
                        for filename in extracted_files:
                            if not self.is_image(filename):
                                continue
                            # ZIP 파일 내부에서 각 파일 읽기
                            with zip_file.open(filename) as extracted_file:
                                # S3에 파일 업로드
                                upload_to_s3(extracted_file, BUCKENAME, filename)
                                s3_url = f"https://{BUCKENAME}.s3.us-east-2.amazonaws.com/{filename}"
                                file_urls.append(s3_url)

                except zipfile.BadZipFile:
                    raise HTTPException(status_code=400, detail="Uploaded file is not a valid ZIP file.")
                except NoCredentialsError:
                    raise HTTPException(status_code=500, detail="AWS credentials not found.")
                except PartialCredentialsError:
                    raise HTTPException(status_code=500, detail="Incomplete AWS credentials.")
                except Exception as e:
                    raise HTTPException(status_code=500, detail=str(e))
                
            else:
                if not self.is_image(file.filename):
                    continue

                file_extension = os.path.splitext(file.filename)[1]  # .jpg, .png 등

                # 고유한 파일 이름 생성
                file_name = f"{str(uuid.uuid4())}{file_extension}"

                upload_to_s3(file.file, BUCKENAME, file_name)
    
                s3_url = f"https://{BUCKENAME}.s3.us-east-2.amazonaws.com/{file_name}"
                file_urls.append(s3_url)

        return file_urls
    
    async def _analysis_data(self, upload_request: UploadRequest, file_urls: List[str]):
        if upload_request.task == "cls":
            url = "http://localhost:8001/dl/api/cls"
        else:
            url = "http://localhost:8001/dl/api/det"

        if upload_request.department_id:
            department = self.db.query(Departments).filter(Departments.department_id == upload_request.department_id).first()
            department_name = department.department_name if department else "None"
        else:
            department_name = "None"

        data = {
            "image_urls": file_urls,
            "model_name": upload_request.model_name,
            "department_name": department_name,
            "user_id": upload_request.user_id,
            "project_id": upload_request.project_id,
            "is_private": upload_request.is_private
        }
        
        headers = {"Content-Type": "application/json"}
        try:
            result = requests.post(url, json = data, headers=headers)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"An unexpected error occurred: {str(e)}"
            )
        
    async def _after_save_upload_batch(self, inserted_id: str):
        try:
            await collection_upload_batches.update_one(
                {"_id": ObjectId(inserted_id)},  # ID로 문서 찾기
                {
                    "$set": {
                        "isDone": True,  # 작업 완료 표시
                        "updatedAt": datetime.now()  # 수정 시간 업데이트
                    }
                }
            )
        except Exception as e:
            raise Exception(f"Failed to update results: {str(e)}")
        
    async def _mapping_user_upload_batches(self, project_id: str, user_id: int, upload_batch_id: str):
        try:
            # 기존 document 확인
            existing_doc = await collection_user_upload_batches.find_one()

            # 문서가 없을 경우 새로운 문서 생성
            if existing_doc is None:
                new_document = {
                    "project": {}
                }
                await collection_user_upload_batches.insert_one(new_document)
                existing_doc = new_document

            # project_id와 user_id에 해당하는 배열이 있는지 확인
            project_data = existing_doc.get("project", {})
            user_data = project_data.get(str(project_id), {})
            current_batches = user_data.get(str(user_id), [])

            # 새로운 batch_id를 추가하고 중복 제거
            updated_batches = list(set(current_batches + [upload_batch_id]))

            # 업데이트 수행
            await collection_user_upload_batches.update_one(
                {},
                {
                    "$set": {
                        f"project.{str(project_id)}.{str(user_id)}": updated_batches
                    }
                }
            )
        except Exception as e:
            raise Exception(f"Failed to update histories: {str(e)}")