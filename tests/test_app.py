from fastapi.testclient import TestClient

from backend.app import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_empty_job_description():
    response = client.post(
        "/api/analyze",
        json={"job_description": ""},
    )

    assert response.status_code == 422


def test_short_job_description():
    response = client.post(
        "/api/analyze",
        json={"job_description": "AI Engineer"},
    )

    assert response.status_code == 422


def test_missing_job_description():
    response = client.post("/api/analyze", json={})

    assert response.status_code == 422


def test_frontend_homepage():
    response = client.get("/")

    assert response.status_code == 200
    assert "HireLens-AI" in response.text