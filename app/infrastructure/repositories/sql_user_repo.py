import uuid
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.domain.entities.user import User, UserRole
from app.domain.value_objects.email import Email
from app.domain.entities.driver import Driver, DriverStatus
from app.domain.entities.vehicle import Vehicle
from app.domain.value_objects.location import Location
from app.domain.repositories.user_repo import UserRepository, DriverRepository
from app.infrastructure.database.models.user_model import UserModel, DriverModel, VehicleModel

class SQLUserRepository(UserRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        result = await self.session.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(
            select(UserModel).where(UserModel.email == email)
        )
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None

    async def save(self, user: User) -> None:
        result = await self.session.execute(
            select(UserModel).where(UserModel.id == user.id)
        )
        model = result.scalar_one_or_none()

        if not model:
            model = UserModel(
                id=user.id,
                email=user.email.value,
                hashed_password=user.hashed_password,
                full_name=user.full_name,
                role=user.role,
                is_active=user.is_active,
                is_verified=user.is_verified,
                created_at=user.created_at,
                updated_at=user.updated_at
            )
            self.session.add(model)
        else:
            model.email = user.email.value
            model.hashed_password = user.hashed_password
            model.full_name = user.full_name
            model.role = user.role
            model.is_active = user.is_active
            model.is_verified = user.is_verified
            model.updated_at = user.updated_at

    def _to_domain(self, model: UserModel) -> User:
        return User(
            id=model.id,
            email=Email(model.email),
            full_name=model.full_name,
            role=model.role,
            hashed_password=model.hashed_password,
            is_active=model.is_active,
            is_verified=model.is_verified,
            created_at=model.created_at,
            updated_at=model.updated_at
        )


class SQLDriverRepository(DriverRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, driver_id: uuid.UUID) -> Optional[Driver]:
        result = await self.session.execute(
            select(DriverModel)
            .options(selectinload(DriverModel.vehicle))
            .where(DriverModel.id == driver_id)
        )
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None

    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[Driver]:
        result = await self.session.execute(
            select(DriverModel)
            .options(selectinload(DriverModel.vehicle))
            .where(DriverModel.user_id == user_id)
        )
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None

    async def get_drivers_by_status(self, status: DriverStatus) -> List[Driver]:
        result = await self.session.execute(
            select(DriverModel)
            .options(selectinload(DriverModel.vehicle))
            .where(DriverModel.status == status)
        )
        models = result.scalars().all()
        return [self._to_domain(m) for m in models]

    async def save(self, driver: Driver) -> None:
        result = await self.session.execute(
            select(DriverModel)
            .options(selectinload(DriverModel.vehicle))
            .where(DriverModel.id == driver.id)
        )
        model = result.scalar_one_or_none()

        lat = driver.current_location.latitude if driver.current_location else None
        lon = driver.current_location.longitude if driver.current_location else None

        if not model:
            # First create the vehicle model
            vehicle_model = VehicleModel(
                id=driver.vehicle.id,
                make=driver.vehicle.make,
                model=driver.vehicle.model,
                year=driver.vehicle.year,
                color=driver.vehicle.color,
                license_plate=driver.vehicle.license_plate
            )
            self.session.add(vehicle_model)

            model = DriverModel(
                id=driver.id,
                user_id=driver.user_id,
                license_number=driver.license_number,
                status=driver.status,
                current_lat=lat,
                current_lon=lon,
                is_verified=driver.is_verified,
                vehicle_id=driver.vehicle.id
            )
            self.session.add(model)
        else:
            model.status = driver.status
            model.current_lat = lat
            model.current_lon = lon
            model.is_verified = driver.is_verified
            
            # Update vehicle details
            model.vehicle.make = driver.vehicle.make
            model.vehicle.model = driver.vehicle.model
            model.vehicle.year = driver.vehicle.year
            model.vehicle.color = driver.vehicle.color
            model.vehicle.license_plate = driver.vehicle.license_plate

    def _to_domain(self, model: DriverModel) -> Driver:
        vehicle = Vehicle(
            id=model.vehicle.id,
            make=model.vehicle.make,
            model=model.vehicle.model,
            year=model.vehicle.year,
            color=model.vehicle.color,
            license_plate=model.vehicle.license_plate
        )
        location = Location(model.current_lat, model.current_lon) if model.current_lat is not None else None
        return Driver(
            id=model.id,
            user_id=model.user_id,
            license_number=model.license_number,
            status=model.status,
            vehicle=vehicle,
            current_location=location,
            is_verified=model.is_verified
        )
