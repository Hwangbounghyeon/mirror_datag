import json
import pytest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from fastapi import HTTPException
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_jwt_verify():
    with patch("app.services.auth.auth_service.UserLogin.login") as mock:
        mock.return_value = {"email": "test1@tmail.ws", "password": "1234"}
        yield mock

@pytest.fixture
def mock_upload_service():
    with patch("app.services.project.upload_service.UploadService") as mock:
        yield mock

@pytest.fixture
def mock_db():
    return Mock()

def test_image_upload_success(mock_jwt_verify, mock_upload_service, mock_db):
    upload_request = {
    "project_id": "67316151975201f5b1176329",
    "is_private": "false"
}
    files = [
        ("files", ("test1.jpg", b"file_content_1", "image/jpeg")),
        ("files", ("test2.jpg", b"file_content_2", "image/jpeg"))
    ]
    headers = {"Authorization": "Bearer fake_token"}

    response = client.post(
        "/image/upload",
        data={"upload_request": json.dumps(upload_request)},
        files=files,
        headers=headers
    )

    assert response.status_code == 200
    assert response.json() == {
        "status": 200,
        "data": "이미지 업로드에 성공하였습니다."
    }

    mock_jwt_verify.assert_called_once()
    mock_upload_service.return_value.upload_image.assert_called_once()

def test_image_upload_no_files(mock_jwt_verify, mock_upload_service, mock_db):
    upload_request = {
    "project_id": "67316151975201f5b1176329",
    "is_private": "false"
}
    headers = {"Authorization": "Bearer fake_token"}

    response = client.post(
        "project/image/upload",
        data={"upload_request": json.dumps(upload_request)},
        headers=headers
    )

    assert response.status_code == 200
    assert response.json() == {
        "status": 200,
        "data": "이미지 업로드에 성공하였습니다."
    }

    mock_jwt_verify.assert_called_once()
    mock_upload_service.return_value.upload_image.assert_not_called()

def test_image_upload_invalid_token(mock_jwt_verify, mock_db):
    mock_jwt_verify.side_effect = HTTPException(status_code=401, detail="Invalid token")

    upload_request = {
    "project_id": "67316151975201f5b1176329",
    "is_private": "false"
}
    headers = {"Authorization": "Bearer invalid_token"}

    response = client.post(
        "project/image/upload",
        data={"upload_request": json.dumps(upload_request)},
        headers=headers
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid token"}

def test_image_upload_invalid_request(mock_jwt_verify, mock_db):
    invalid_upload_request = "invalid_json"
    headers = {"Authorization": "Bearer fake_token"}

    response = client.post(
        "project/image/upload",
        data={"upload_request": invalid_upload_request},
        headers=headers
    )

    assert response.status_code == 400
    assert "detail" in response.json()

@pytest.mark.asyncio
async def test_image_upload_background_task(mock_jwt_verify, mock_upload_service, mock_db):
    upload_request = {
    "project_id": "67316151975201f5b1176329",
    "is_private": "false"
}
    files = [
        ("files", ("test1.jpg", b"file_content_1", "image/jpeg")),
    ]
    headers = {"Authorization": "Bearer fake_token"}

    response = await client.post(
        "project/image/upload",
        data={"upload_request": json.dumps(upload_request)},
        files=files,
        headers=headers
    )

    assert response.status_code == 200
    
    # 백그라운드 태스크가 추가되었는지 확인
    mock_upload_service.return_value.upload_image.assert_called_once()