import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from app.domain.entities.ride import RideStatus

class RequestRideRequest(BaseModel):
    pickup_lat: float
    pickup_lon: float
    dest_lat: float
    dest_lon: float

class FareEstimateRequest(BaseModel):
    pickup_lat: float
    pickup_lon: float
    dest_lat: float
    dest_lon: float

class FareEstimateResponse(BaseModel):
    estimated_fare_amount: float
    estimated_fare_currency: str = "USD"
    distance_km: float
    estimated_duration_minutes: float

class RideResponse(BaseModel):
    id: uuid.UUID
    rider_id: uuid.UUID
    driver_id: Optional[uuid.UUID] = None
    pickup_lat: float
    pickup_lon: float
    dest_lat: float
    dest_lon: float
    estimated_fare_amount: float
    estimated_fare_currency: str
    status: RideStatus
    created_at: datetime
    accepted_at: Optional[datetime] = None
    arrived_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
