import pytest
from httpx import AsyncClient, ASGITransport
from app.api.v1.router import app
from app.api.deps import get_user_repo
from unittest.mock import AsyncMock

@pytest.fixture
def mock_user_repository():
    repo = AsyncMock()
    # Mock behavior for registration checks
    repo.get_by_email.return_value = None
    return repo

@pytest.mark.asyncio
async def test_register_user_endpoint(mock_user_repository):
    # Override FastAPI dependencies for clean mocking
    app.dependency_overrides[get_user_repo] = lambda: mock_user_repository
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/register", json={
            "email": "rider@example.com",
            "full_name": "John Doe",
            "password": "strongpassword123",
            "role": "rider"
        })
        
    assert response.status_code == 201
    assert "registered successfully" in response.json()["message"]
    
    # Clean up overrides
    app.dependency_overrides.clear()
