from dataclasses import dataclass, field
import uuid
from enum import Enum
from typing import Optional
from app.domain.entities.vehicle import Vehicle
from app.domain.value_objects.location import Location

class DriverStatus(str, Enum):
    OFFLINE = "offline"
    ONLINE = "online"
    ON_TRIP = "on_trip"

@dataclass
class Driver:
    user_id: uuid.UUID
    license_number: str
    vehicle: Vehicle
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    status: DriverStatus = DriverStatus.OFFLINE
    current_location: Optional[Location] = None
    is_verified: bool = False

    def go_online(self):
        self.status = DriverStatus.ONLINE

    def go_offline(self):
        self.status = DriverStatus.OFFLINE

    def assign_to_trip(self):
        self.status = DriverStatus.ON_TRIP

    def complete_trip(self):
        self.status = DriverStatus.ONLINE

    def update_location(self, location: Location):
        self.current_location = location

    def verify_driver(self):
        self.is_verified = True
