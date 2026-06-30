from dataclasses import dataclass, field
import uuid
from datetime import datetime
from enum import Enum
from typing import List, Optional
from app.domain.value_objects.location import Location
from app.domain.value_objects.money import Money

class RideStatus(str, Enum):
    REQUESTED = "requested"
    ACCEPTED = "accepted"
    ARRIVED = "arrived"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

@dataclass
class Ride:
    rider_id: uuid.UUID
    pickup_location: Location
    destination_location: Location
    estimated_fare: Money
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    driver_id: Optional[uuid.UUID] = None
    status: RideStatus = RideStatus.REQUESTED
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    accepted_at: Optional[datetime] = None
    arrived_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    
    # Domain events collected for dispatching
    events: List[object] = field(default_factory=list, compare=False, hash=False)

    def accept(self, driver_id: uuid.UUID):
        if self.status != RideStatus.REQUESTED:
            raise ValueError(f"Cannot accept ride in status {self.status}")
        self.status = RideStatus.ACCEPTED
        self.driver_id = driver_id
        self.accepted_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        
        # Import dynamically to avoid circular references
        from app.domain.events.ride_events import DriverAssigned
        self.events.append(DriverAssigned(ride_id=self.id, driver_id=driver_id))

    def driver_arrived(self):
        if self.status != RideStatus.ACCEPTED:
            raise ValueError(f"Cannot mark arrived from status {self.status}")
        self.status = RideStatus.ARRIVED
        self.arrived_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def start(self):
        if self.status != RideStatus.ARRIVED:
            raise ValueError(f"Cannot start ride from status {self.status}")
        self.status = RideStatus.IN_PROGRESS
        self.started_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def complete(self):
        if self.status != RideStatus.IN_PROGRESS:
            raise ValueError(f"Cannot complete ride from status {self.status}")
        self.status = RideStatus.COMPLETED
        self.completed_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        
        from app.domain.events.ride_events import RideCompleted
        self.events.append(RideCompleted(
            ride_id=self.id, 
            rider_id=self.rider_id, 
            driver_id=self.driver_id, 
            fare=self.estimated_fare
        ))

    def cancel(self):
        if self.status in [RideStatus.COMPLETED, RideStatus.CANCELLED]:
            raise ValueError(f"Cannot cancel ride from status {self.status}")
        self.status = RideStatus.CANCELLED
        self.cancelled_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        
        from app.domain.events.ride_events import RideCancelled
        self.events.append(RideCancelled(ride_id=self.id))

    def clear_events(self):
        self.events.clear()
