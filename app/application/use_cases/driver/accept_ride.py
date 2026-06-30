import uuid
from app.domain.entities.ride import Ride
from app.domain.repositories.ride_repo import RideRepository
from app.domain.repositories.user_repo import DriverRepository
from app.domain.entities.driver import DriverStatus
from app.infrastructure.messaging.redis_pubsub import RedisEventBus

class AcceptRideUseCase:
    def __init__(self, ride_repo: RideRepository, driver_repo: DriverRepository, event_bus: RedisEventBus):
        self.ride_repo = ride_repo
        self.driver_repo = driver_repo
        self.event_bus = event_bus

    async def execute(self, ride_id: uuid.UUID, driver_id: uuid.UUID) -> Ride:
        ride = await self.ride_repo.get_by_id(ride_id)
        if not ride:
            raise ValueError("Ride request not found")

        driver = await self.driver_repo.get_by_id(driver_id)
        if not driver:
            raise ValueError("Driver profile not found")

        if driver.status != DriverStatus.ONLINE:
            raise ValueError("Driver is not available to accept rides")

        # Mutate domain models
        ride.accept(driver.id)
        driver.assign_to_trip()

        # Save updates
        await self.ride_repo.save(ride)
        await self.driver_repo.save(driver)

        # Dispatch events collected in the entity aggregate
        for event in ride.events:
            await self.event_bus.publish("ride_events", event)
        ride.clear_events()

        return ride
