import uuid
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.entities.ride import Ride, RideStatus
from app.domain.value_objects.location import Location
from app.domain.value_objects.money import Money
from app.domain.repositories.ride_repo import RideRepository
from app.infrastructure.database.models.ride_model import RideModel

class SQLRideRepository(RideRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, ride_id: uuid.UUID) -> Optional[Ride]:
        result = await self.session.execute(
            select(RideModel).where(RideModel.id == ride_id)
        )
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None

    async def get_rides_by_rider(self, rider_id: uuid.UUID) -> List[Ride]:
        result = await self.session.execute(
            select(RideModel).where(RideModel.rider_id == rider_id).order_by(RideModel.created_at.desc())
        )
        models = result.scalars().all()
        return [self._to_domain(m) for m in models]

    async def get_rides_by_driver(self, driver_id: uuid.UUID) -> List[Ride]:
        result = await self.session.execute(
            select(RideModel).where(RideModel.driver_id == driver_id).order_by(RideModel.created_at.desc())
        )
        models = result.scalars().all()
        return [self._to_domain(m) for m in models]

    async def get_rides_by_status(self, status: RideStatus) -> List[Ride]:
        result = await self.session.execute(
            select(RideModel).where(RideModel.status == status).order_by(RideModel.created_at.desc())
        )
        models = result.scalars().all()
        return [self._to_domain(m) for m in models]

    async def save(self, ride: Ride) -> None:
        result = await self.session.execute(
            select(RideModel).where(RideModel.id == ride.id)
        )
        model = result.scalar_one_or_none()

        if not model:
            model = RideModel(
                id=ride.id,
                rider_id=ride.rider_id,
                driver_id=ride.driver_id,
                pickup_lat=ride.pickup_location.latitude,
                pickup_lon=ride.pickup_location.longitude,
                dest_lat=ride.destination_location.latitude,
                dest_lon=ride.destination_location.longitude,
                estimated_fare_amount=float(ride.estimated_fare.amount),
                estimated_fare_currency=ride.estimated_fare.currency,
                status=ride.status,
                created_at=ride.created_at,
                updated_at=ride.updated_at,
                accepted_at=ride.accepted_at,
                arrived_at=ride.arrived_at,
                started_at=ride.started_at,
                completed_at=ride.completed_at,
                cancelled_at=ride.cancelled_at
            )
            self.session.add(model)
        else:
            model.driver_id = ride.driver_id
            model.status = ride.status
            model.updated_at = ride.updated_at
            model.accepted_at = ride.accepted_at
            model.arrived_at = ride.arrived_at
            model.started_at = ride.started_at
            model.completed_at = ride.completed_at
            model.cancelled_at = ride.cancelled_at

    def _to_domain(self, model: RideModel) -> Ride:
        pickup = Location(model.pickup_lat, model.pickup_lon)
        destination = Location(model.dest_lat, model.dest_lon)
        estimated_fare = Money(model.estimated_fare_amount, model.estimated_fare_currency)
        
        return Ride(
            id=model.id,
            rider_id=model.rider_id,
            driver_id=model.driver_id,
            pickup_location=pickup,
            destination_location=destination,
            estimated_fare=estimated_fare,
            status=model.status,
            created_at=model.created_at,
            updated_at=model.updated_at,
            accepted_at=model.accepted_at,
            arrived_at=model.arrived_at,
            started_at=model.started_at,
            completed_at=model.completed_at,
            cancelled_at=model.cancelled_at
        )
