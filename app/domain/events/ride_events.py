from dataclasses import dataclass
import uuid
from datetime import datetime
from app.domain.value_objects.money import Money

@dataclass(frozen=True, kw_only=True)
class RideEvent:
    occurred_at: datetime = datetime.utcnow()

@dataclass(frozen=True, kw_only=True)
class RideRequested(RideEvent):
    ride_id: uuid.UUID
    rider_id: uuid.UUID
    pickup_lat: float
    pickup_lon: float
    dest_lat: float
    dest_lon: float
    estimated_fare: Money

@dataclass(frozen=True, kw_only=True)
class DriverAssigned(RideEvent):
    ride_id: uuid.UUID
    driver_id: uuid.UUID

@dataclass(frozen=True, kw_only=True)
class RideCompleted(RideEvent):
    ride_id: uuid.UUID
    rider_id: uuid.UUID
    driver_id: uuid.UUID
    fare: Money

@dataclass(frozen=True, kw_only=True)
class RideCancelled(RideEvent):
    ride_id: uuid.UUID
