import asyncio
import uuid
from celery.utils.log import get_task_logger
from app.infrastructure.tasks.celery_app import celery_app
from app.infrastructure.database.session import async_session_maker
from app.infrastructure.repositories.sql_user_repo import SQLDriverRepository
from app.infrastructure.repositories.sql_ride_repo import SQLRideRepository
from app.domain.services.matching_service import MatchingService
from app.domain.entities.driver import DriverStatus
from app.domain.entities.ride import RideStatus
from app.infrastructure.messaging.redis_pubsub import RedisEventBus

logger = get_task_logger(__name__)

async def run_async_matching(ride_id_str: str, retry_count: int = 0) -> None:
    ride_id = uuid.UUID(ride_id_str)
    
    async with async_session_maker() as session:
        ride_repo = SQLRideRepository(session)
        driver_repo = SQLDriverRepository(session)
        matching_service = MatchingService()
        event_bus = RedisEventBus()
        
        ride = await ride_repo.get_by_id(ride_id)
        if not ride or ride.status != RideStatus.REQUESTED:
            logger.info(f"Ride {ride_id} already matched or cancelled.")
            return

        # Fetch available drivers
        online_drivers = await driver_repo.get_drivers_by_status(DriverStatus.ONLINE)
        
        # Match driver
        best_driver = matching_service.find_best_driver(ride, online_drivers)
        
        if best_driver:
            # Assign
            ride.accept(best_driver.id)
            best_driver.assign_to_trip()
            
            await ride_repo.save(ride)
            await driver_repo.save(best_driver)
            await session.commit()
            
            # Dispatch event to sync WebSockets
            for event in ride.events:
                await event_bus.publish("ride_events", event)
            
            logger.info(f"Successfully matched driver {best_driver.id} to ride {ride_id}")
        else:
            if retry_count < 5:
                logger.info(f"No driver found for ride {ride_id}. Retrying in 10s... (Attempt {retry_count + 1})")
                # Reschedule via Celery
                trigger_driver_matching.apply_async(
                    args=[ride_id_str, retry_count + 1], 
                    countdown=10
                )
            else:
                logger.info(f"Matching timeout for ride {ride_id}. Cancelling ride request.")
                ride.cancel()
                await ride_repo.save(ride)
                await session.commit()
                
                # Dispatch event
                for event in ride.events:
                    await event_bus.publish("ride_events", event)

@celery_app.task(name="tasks.trigger_driver_matching")
def trigger_driver_matching(ride_id_str: str, retry_count: int = 0):
    asyncio.run(run_async_matching(ride_id_str, retry_count))
