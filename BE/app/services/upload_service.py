from fastapi import  HTTPException
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from datetime import datetime, timezone
from sqlalchemy.orm import Session
import mimetypes
import zipfile
import requests
import uuid
import io
import os
import json


from models.mariadb_users import UploadBatches, Departments
from dto.uploads_dto import UploadRequest
from configs.s3 import upload_to_s3



BUCKENAME = 'ssafy-project'


class Upload:
    def __init__(self, db : Session):
        self.db = db

    def is_image(self, filename : str):
        mime_type, _ = mimetypes.guess_type(filename)
        return mimetypes is not None and mime_type.startswith("image")

    async def upload_image(self, upload_request: UploadRequest, files: list):

        # 이미지 업로드 확인 Table 생성
        batch_before = UploadBatches(
        project_id=upload_request.project_id,
        user_id=upload_request.user_id,
        is_done=0,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
        )

        self.db.add(batch_before)
        self.db.commit()
        self.db.refresh(batch_before)


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

        if upload_request.task == "cls":
            url = "http://127.0.0.1:8080/cls"
        else:
            url = "http://127.0.0.1:8080/det"

        if upload_request.department_id:
            department = self.db.query(Departments).filter(Departments.department_id == upload_request.department_id).first()
            department_name = department.department_name if department else None
        else:
            department_name = None

        data = {
            "image_urls": file_urls,
            "model_name": upload_request.model_name,
            "department_name": department_name or "",
            "user_id": upload_request.user_id,
            "project_id": upload_request.project_id,
            "is_private": upload_request.is_private
        }

        # json_data = json.dumps(data)

        print(data)

        headers = {"Content-Type": "application/json"}
        try:
            result = requests.post(url, json = data, headers=headers)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"An unexpected error occurred: {str(e)}"
            )

        batch_after = self.db.query(UploadBatches).filter(UploadBatches.upload_batch_id == batch_before.upload_batch_id)
        if batch_after:
            batch_after.is_done = 1
            batch_after.updated_at = datetime.now(timezone.utc)
            self.db.commit()


        return file_urls