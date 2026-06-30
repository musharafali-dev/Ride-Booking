import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from app.domain.entities.user import UserRole
from app.domain.entities.driver import DriverStatus

class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UpdateProfileRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)

class VehicleSchema(BaseModel):
    id: uuid.UUID
    make: str
    model: str
    year: int
    color: str
    license_plate: str

    class Config:
        from_attributes = True

class DriverResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    license_number: str
    status: DriverStatus
    current_lat: Optional[float]
    current_lon: Optional[float]
    is_verified: bool
    vehicle: VehicleSchema

    class Config:
        from_attributes = True

class DriverRegisterRequest(BaseModel):
    license_number: str = Field(..., min_length=5, max_length=50)
    vehicle_make: str = Field(..., min_length=2)
    vehicle_model: str = Field(..., min_length=1)
    vehicle_year: int = Field(..., gt=1900)
    vehicle_color: str = Field(..., min_length=2)
    vehicle_license_plate: str = Field(..., min_length=3, max_length=20)
