from abc import ABC, abstractmethod
import uuid
from typing import Optional, List
from app.domain.entities.ride import Ride, RideStatus

class RideRepository(ABC):
    @abstractmethod
    async def get_by_id(self, ride_id: uuid.UUID) -> Optional[Ride]:
        pass

    @abstractmethod
    async def get_rides_by_rider(self, rider_id: uuid.UUID) -> List[Ride]:
        pass

    @abstractmethod
    async def get_rides_by_driver(self, driver_id: uuid.UUID) -> List[Ride]:
        pass

    @abstractmethod
    async def get_rides_by_status(self, status: RideStatus) -> List[Ride]:
        pass

    @abstractmethod
    async def save(self, ride: Ride) -> None:
        pass
