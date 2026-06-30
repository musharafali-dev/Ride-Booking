from dataclasses import dataclass
import uuid

@dataclass(frozen=True)
class RequestRideCommand:
    rider_id: uuid.UUID
    pickup_lat: float
    pickup_lon: float
    dest_lat: float
    dest_lon: float
    ride_type: str = "standard"

@dataclass(frozen=True)
class AcceptRideCommand:
    ride_id: uuid.UUID
    driver_id: uuid.UUID

@dataclass(frozen=True)
class CompleteRideCommand:
    ride_id: uuid.UUID
    driver_id: uuid.UUID

@dataclass(frozen=True)
class CancelRideCommand:
    ride_id: uuid.UUID
    user_id: uuid.UUID  # Can be Rider or Driver
