import pytest
import json
import sys
import os

from fastapi.testclient import TestClient
from fastapi import HTTPException

from app.main import app
from app.configs.mariadb import get_database_mariadb
from app.configs.mongodb import client as mongo_client

from unittest.mock import Mock, patch

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'app')))

client = TestClient(app)

# 1. 프로젝트 생성 테스트
def test_create_project():
    response = client.post(
        "/project",
        json={
            "user_id": 1,
            "project_name": "New Project",
            "model_name": "vgg19_bn",
            "description": "This is a description of the new project.",
            "accesscontrol": {
                "view_users": ["user1", "user2", "user3"],
                "edit_users": ["user6", "user7", "user10"],
                "view_departments": ["department1", "department2"],
                "edit_departments": ["department3", "department4"]
            },
            "is_private": 0
        }
    )
    assert response.status_code == 200
    assert response.json()["status"] == 200
    assert "data" in response.json()

# 2. 프로젝트 리스트 조회 테스트
def test_get_project_list():
    response = client.get(
        "/project/list",
        json={
            "user_id": 1,
            "department_id": 1,
            "select_department": "department1",
            "select_model_name": "vgg19_bn"
        }
    )
    assert response.status_code == 200
    assert response.json()["status"] == 200
    assert isinstance(response.json()["data"], list)

# 3. 프로젝트 삭제 테스트
def test_delete_project():
    # 삭제할 프로젝트 ID가 1이라고 가정
    response = client.delete("/project/1")
    assert response.status_code == 200
    assert response.json()["status"] == 200
    assert response.json()["data"]["message"] == "Project deleted successfully"

# 4. 부서 리스트 조회 테스트
def test_get_department_list():
    response = client.get("/project/departments")
    assert response.status_code == 200
    assert response.json()["status"] == 200
    assert isinstance(response.json()["data"], list)

# 5. 사용자 이름 검색 테스트
def test_search_user_name():
    response = client.get("/project/users/search", params={"name": "user1"})
    assert response.status_code == 200
    assert response.json()["status"] == 200
    assert isinstance(response.json()["data"], list)

# 6. 프로젝트에 필터링된 이미지 저장
def test_filter_image_add(auth_headers, mock_upload_service, mock_db):
    add_filtering_image_request = {
    "project_id": "6732f477fcec9d2c66a7507c",
    "conditions": ["and_condition"]
    }
    files = [
        ("files", ("test1.jpg", b"file_content_1", "image/jpeg")),
        ("files", ("test2.jpg", b"file_content_2", "image/jpeg"))
    ]
    session = mongo_client.start_session()
    session.start_transaction()

    response = client.post(
        "be/api/project/filterImage/{project_id}/list",
        data={"add_filtering_image_request": json.dumps(add_filtering_image_request)},
        files=files,
        headers=auth_headers
    )

    session.abort_transaction()

    assert response.status_code == 200
    assert response.json() == {
        "status": 200,
        "data": "이미지 업로드에 성공하였습니다."
    }

    mock_upload_service.return_value.upload_image.assert_called_once()