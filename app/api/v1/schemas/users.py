import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from app.domain.entities.user import UserRole

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


