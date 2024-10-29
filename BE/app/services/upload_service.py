from fastapi import  HTTPException
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from datetime import datetime, timezone
from sqlalchemy.orm import Session
import mimetypes
import zipfile
import requests
import io
import json



from models.mariadb_users import UploadBatch
from dto.uploads import UploadBase
from configs.s3 import upload_to_s3



BUCKENAME = 'ssafy-project'


class Upload:
    def __init__(self, db : Session):
        self.db = db

    def is_image(self, filename : str):
        mime_type, _ = mimetypes.guess_type(filename)
        return mimetypes is not None and mime_type.startswith("image")

    async def upload_image(self, upload_base: UploadBase, files: list):

        # 이미지 업로드 확인 Table 생성
        batch_before = UploadBatch(
            project_id = upload_base["project_id"],
            user_id = upload_base["user_id"],
            is_done = 0,
            created_at = datetime.now(timezone.utc),
            updated_at = datetime.now(timezone.utc)
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

                upload_to_s3(file.file, BUCKENAME, file.filename)
    
                s3_url = f"https://{BUCKENAME}.s3.us-east-2.amazonaws.com/{file.filename}"
                file_urls.append(s3_url)

        if upload_base["task"] == "cls":
            url = "http://127.0.0.1:8080/cls"
        else:
            url = "http://127.0.0.1:8080/det"

        data = {
            "image_urls": file_urls,
            "model_name": upload_base["model_name"],
            "user_id": upload_base["user_id"],
            "project_id": upload_base["project_id"],
            "is_private": upload_base["is_private"]
        }
        json_data = json.dumps(data)

        headers = {"Content-Type": "application/json"}

        requests.post(url, data = json_data, headers=headers)

        batch_after = self.db.query(UploadBatch).filter(UploadBatch.upload_batch_id == batch_before.upload_batch_id)
        if batch_after:
            batch_after.is_done = 1
            batch_after.updated_at = datetime.now(timezone.utc)
            self.db.commit()


        return file_urls