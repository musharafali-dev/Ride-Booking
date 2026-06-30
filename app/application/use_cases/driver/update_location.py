import uuid
from app.domain.value_objects.location import Location
from app.domain.repositories.user_repo import DriverRepository
from app.infrastructure.messaging.redis_pubsub import RedisEventBus

class UpdateLocationUseCase:
    def __init__(self, driver_repo: DriverRepository, event_bus: RedisEventBus):
        self.driver_repo = driver_repo
        self.event_bus = event_bus

    async def execute(self, driver_id: uuid.UUID, latitude: float, longitude: float) -> None:
        driver = await self.driver_repo.get_by_id(driver_id)
        if not driver:
            raise ValueError("Driver not found")

        location = Location(latitude, longitude)
        driver.update_location(location)

        await self.driver_repo.save(driver)

        # Publish a location update event to sync ride-tracking WebSockets
        update_payload = {
            "driver_id": str(driver.id),
            "latitude": latitude,
            "longitude": longitude
        }
        await self.event_bus.publish_raw(f"driver_location:{driver.id}", update_payload)
