from dataclasses import dataclass
import uuid
from typing import Optional

@dataclass(frozen=True)
class GetRideQuery:
    ride_id: uuid.UUID

@dataclass(frozen=True)
class GetRiderHistoryQuery:
    rider_id: uuid.UUID
    limit: int = 10
    offset: int = 0
