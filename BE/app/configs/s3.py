from boto3 import client
import io
import os
from dotenv import load_dotenv

load_dotenv()

s3_client = client(
    "s3",
    aws_access_key_id = os.getenv("S3_ACCESS_KEY"), 
    aws_secret_access_key = os.getenv('S3_SECRET_ACCESS_KEY'), 
    region_name = os.getenv('S3_REIGN_NAME')
)

def upload_to_s3(file: io.BytesIO, bucket_name: str, file_name: str) -> None:
    s3_client.upload_fileobj(
        file,
        bucket_name,
        file_name,
        ExtraArgs={"ContentType": "image/jpeg", "ACL": "public-read"},
    )
