import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Enum as SAEnum, ForeignKey, Float, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.infrastructure.database.base import Base
from app.domain.entities.ride import RideStatus

class RideModel(Base):
    __tablename__ = "rides"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rider_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    driver_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("drivers.id"), nullable=True)
    
    pickup_lat: Mapped[float] = mapped_column(Float, nullable=False)
    pickup_lon: Mapped[float] = mapped_column(Float, nullable=False)
    dest_lat: Mapped[float] = mapped_column(Float, nullable=False)
    dest_lon: Mapped[float] = mapped_column(Float, nullable=False)
    
    estimated_fare_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    estimated_fare_currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    
    status: Mapped[RideStatus] = mapped_column(SAEnum(RideStatus, name="ride_status"), default=RideStatus.REQUESTED, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    accepted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    arrived_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    rider = relationship("UserModel", back_populates="rides_as_rider", foreign_keys=[rider_id])
    driver = relationship("DriverModel", back_populates="rides_as_driver", foreign_keys=[driver_id])
    payment = relationship("PaymentModel", back_populates="ride", uselist=False)
