import uuid
from app.domain.repositories.ride_repo import RideRepository
from app.infrastructure.messaging.redis_pubsub import RedisEventBus

class CancelRideUseCase:
    def __init__(self, ride_repo: RideRepository, event_bus: RedisEventBus):
        self.ride_repo = ride_repo
        self.event_bus = event_bus

    async def execute(self, ride_id: uuid.UUID) -> None:
        ride = await self.ride_repo.get_by_id(ride_id)
        if not ride:
            raise ValueError("Ride request not found")

        ride.cancel()
        await self.ride_repo.save(ride)

        for event in ride.events:
            await self.event_bus.publish("ride_events", event)
        ride.clear_events()
        
