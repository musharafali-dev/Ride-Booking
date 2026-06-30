import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.infrastructure.database.base import Base
from app.domain.entities.user import UserRole
from app.domain.entities.driver import DriverStatus

class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole, name="user_role"), default=UserRole.RIDER, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    rides_as_rider = relationship("RideModel", back_populates="rider", foreign_keys="[RideModel.rider_id]")
    driver_profile = relationship("DriverModel", back_populates="user", uselist=False, cascade="all, delete-orphan")
    payments = relationship("PaymentModel", back_populates="user")


class VehicleModel(Base):
    __tablename__ = "vehicles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    make: Mapped[str] = mapped_column(String(50), nullable=False)
    model: Mapped[str] = mapped_column(String(50), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    color: Mapped[str] = mapped_column(String(30), nullable=False)
    license_plate: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)

    driver = relationship("DriverModel", back_populates="vehicle", uselist=False)


class DriverModel(Base):
    __tablename__ = "drivers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    license_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    status: Mapped[DriverStatus] = mapped_column(SAEnum(DriverStatus, name="driver_status"), default=DriverStatus.OFFLINE, nullable=False)
    current_lat: Mapped[float] = mapped_column(Float, nullable=True)
    current_lon: Mapped[float] = mapped_column(Float, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    vehicle_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False, unique=True)

    # Relationships
    user = relationship("UserModel", back_populates="driver_profile")
    vehicle = relationship("VehicleModel", back_populates="driver", cascade="all, delete-orphan", single_parent=True)
    rides_as_driver = relationship("RideModel", back_populates="driver", foreign_keys="[RideModel.driver_id]")
