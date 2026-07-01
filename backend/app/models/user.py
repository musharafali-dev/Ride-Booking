import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    country = Column(String, nullable=True)
    city = Column(String, nullable=True)
    business_name = Column(String, nullable=True)
    cnic_passport = Column(String, nullable=True)
    business_registration = Column(String, nullable=True)
    tax_number = Column(String, nullable=True)
    experience_years = Column(String, nullable=True)
    status = Column(String, default="ACTIVE") # PENDING, ACTIVE, REJECTED, SUSPENDED, BLOCKED
    role = Column(String, default="customer") # customer, driver, owner, operator, admin
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    license_number = Column(String, nullable=True)
    wallet_balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    bookings = relationship("Booking", back_populates="customer", foreign_keys="Booking.customer_id")
    trips = relationship("Booking", back_populates="driver", foreign_keys="Booking.driver_id")
    vehicles = relationship("Vehicle", back_populates="owner")
