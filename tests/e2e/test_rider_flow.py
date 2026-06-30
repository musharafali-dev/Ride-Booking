import pytest
from httpx import AsyncClient, ASGITransport
from app.api.v1.router import app
from unittest.mock import AsyncMock
import uuid
from app.api.deps import get_user_repo, get_ride_repo, get_driver_repo, get_payment_repo, get_current_user, get_event_bus
from app.domain.entities.user import User, UserRole
from app.domain.entities.driver import Driver, DriverStatus
from app.domain.entities.vehicle import Vehicle
from app.domain.value_objects.email import Email

@pytest.fixture
def mock_db_repos():
    user_repo = AsyncMock()
    driver_repo = AsyncMock()
    ride_repo = AsyncMock()
    payment_repo = AsyncMock()

    # Setup mock user (rider)
    rider = User(
        id=uuid.uuid4(),
        email=Email("rider@example.com"),
        full_name="Jane Rider",
        role=UserRole.RIDER,
        hashed_password="hashed_pass"
    )
    user_repo.get_by_id.return_value = rider
    user_repo.get_by_email.return_value = rider

    # Setup mock driver
    vehicle = Vehicle(make="Toyota", model="Prius", year=2021, color="Blue", license_plate="XYZ123")
    driver = Driver(user_id=uuid.uuid4(), license_number="LIC456", vehicle=vehicle, status=DriverStatus.ONLINE)
    driver_repo.get_by_user_id.return_value = driver
    driver_repo.get_by_id.return_value = driver
    driver_repo.get_drivers_by_status.return_value = [driver]

    return rider, user_repo, driver_repo, ride_repo, payment_repo

@pytest.mark.asyncio
async def test_full_rider_booking_flow(mock_db_repos):
    rider, user_repo, driver_repo, ride_repo, payment_repo = mock_db_repos

    app.dependency_overrides[get_current_user] = lambda: rider
    app.dependency_overrides[get_user_repo] = lambda: user_repo
    app.dependency_overrides[get_driver_repo] = lambda: driver_repo
    app.dependency_overrides[get_ride_repo] = lambda: ride_repo
    app.dependency_overrides[get_payment_repo] = lambda: payment_repo
    app.dependency_overrides[get_event_bus] = lambda: AsyncMock()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. User estimates fare
        est_resp = await ac.post("/api/v1/rides/estimate", json={
            "pickup_lat": 37.7749,
            "pickup_lon": -122.4194,
            "dest_lat": 37.7892,
            "dest_lon": -122.4014
        })
        assert est_resp.status_code == 200
        assert est_resp.json()["estimated_fare_amount"] > 0.0

        # Mock successful login token header bypass for current_user
        headers = {"Authorization": "Bearer mock_access_token"}

        # 2. User requests ride
        req_resp = await ac.post("/api/v1/rides/request", json={
            "pickup_lat": 37.7749,
            "pickup_lon": -122.4194,
            "dest_lat": 37.7892,
            "dest_lon": -122.4014
        }, headers=headers)
        assert req_resp.status_code == 201

    # Reset overrides
    app.dependency_overrides.clear()
