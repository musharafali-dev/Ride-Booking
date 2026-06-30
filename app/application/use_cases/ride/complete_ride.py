import uuid
from app.domain.entities.ride import Ride
from app.domain.repositories.ride_repo import RideRepository
from app.domain.repositories.user_repo import DriverRepository
from app.infrastructure.messaging.redis_pubsub import RedisEventBus

class CompleteRideUseCase:
    def __init__(self, ride_repo: RideRepository, driver_repo: DriverRepository, event_bus: RedisEventBus):
        self.ride_repo = ride_repo
        self.driver_repo = driver_repo
        self.event_bus = event_bus

    async def execute(self, ride_id: uuid.UUID, driver_id: uuid.UUID) -> Ride:
        ride = await self.ride_repo.get_by_id(ride_id)
        if not ride:
            raise ValueError("Ride not found")

        if ride.driver_id != driver_id:
            raise ValueError("Driver is not assigned to this ride")

        driver = await self.driver_repo.get_by_id(driver_id)
        if not driver:
            raise ValueError("Driver not found")

        # Mutate domain models
        ride.complete()
        driver.complete_trip()

        # Save updates
        await self.ride_repo.save(ride)
        await self.driver_repo.save(driver)

        # Dispatch events
        for event in ride.events:
            await self.event_bus.publish("ride_events", event)
        ride.clear_events()

        return ride
