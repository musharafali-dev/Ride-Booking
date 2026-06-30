from dataclasses import dataclass
import uuid
from datetime import datetime
from typing import Optional

@dataclass(frozen=True)
class RideDTO:
    id: uuid.UUID
    rider_id: uuid.UUID
    driver_id: Optional[uuid.UUID]
    pickup_lat: float
    pickup_lon: float
    dest_lat: float
    dest_lon: float
    estimated_fare_amount: float
    estimated_fare_currency: str
    status: str
    created_at: datetime
    accepted_at: Optional[datetime]
    arrived_at: Optional[datetime]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    cancelled_at: Optional[datetime]

    @classmethod
    def from_domain(cls, ride) -> 'RideDTO':
        return cls(
            id=ride.id,
            rider_id=ride.rider_id,
            driver_id=ride.driver_id,
            pickup_lat=ride.pickup_location.latitude,
            pickup_lon=ride.pickup_location.longitude,
            dest_lat=ride.destination_location.latitude,
            dest_lon=ride.destination_location.longitude,
            estimated_fare_amount=float(ride.estimated_fare.amount),
            estimated_fare_currency=ride.estimated_fare.currency,
            status=ride.status.value,
            created_at=ride.created_at,
            accepted_at=ride.accepted_at,
            arrived_at=ride.arrived_at,
            started_at=ride.started_at,
            completed_at=ride.completed_at,
            cancelled_at=ride.cancelled_at
        )
