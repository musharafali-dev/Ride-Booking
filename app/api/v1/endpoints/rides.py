from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid
from app.api.v1.schemas.rides import RequestRideRequest, RideResponse, FareEstimateRequest, FareEstimateResponse
from app.api.deps import get_current_user, get_ride_repo, get_event_bus
from app.domain.entities.user import User
from app.domain.entities.ride import Ride
from app.domain.value_objects.location import Location
from app.domain.services.pricing_service import PricingService
from app.infrastructure.repositories.sql_ride_repo import SQLRideRepository
from app.infrastructure.messaging.redis_pubsub import RedisEventBus
from app.application.use_cases.ride.request_ride import RequestRideUseCase
from app.application.use_cases.ride.cancel_ride import CancelRideUseCase
from app.application.dto.ride_dto import RideDTO

router = APIRouter(prefix="/rides", tags=["Rides"])
pricing_service = PricingService()

@router.post("/request", response_model=RideResponse, status_code=status.HTTP_201_CREATED)
async def request_ride(
    request: RequestRideRequest,
    current_user: User = Depends(get_current_user),
    ride_repo: SQLRideRepository = Depends(get_ride_repo),
    event_bus: RedisEventBus = Depends(get_event_bus)
):
    if current_user.role.value != "rider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Only riders can request rides"
        )
    
    use_case = RequestRideUseCase(ride_repo, pricing_service, event_bus)
    try:
        ride = await use_case.execute(
            rider_id=current_user.id,
            pickup_lat=request.pickup_lat,
            pickup_lon=request.pickup_lon,
            dest_lat=request.dest_lat,
            dest_lon=request.dest_lon
        )
        return RideResponse.model_validate(RideDTO.from_domain(ride))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/estimate", response_model=FareEstimateResponse)
async def estimate_fare(request: FareEstimateRequest):
    pickup = Location(request.pickup_lat, request.pickup_lon)
    destination = Location(request.dest_lat, request.dest_lon)
    
    # Calculate simple geodesic estimations
    distance = pickup.distance_to(destination)
    duration = (distance / 40.0) * 60.0  # Assumes 40 km/h average city speed
    
    fare = pricing_service.estimate_fare(pickup, destination)
    
    return FareEstimateResponse(
        estimated_fare_amount=float(fare.amount),
        estimated_fare_currency=fare.currency,
        distance_km=round(distance, 2),
        estimated_duration_minutes=round(duration, 1)
    )

@router.post("/{ride_id}/cancel", response_model=RideResponse)
async def cancel_ride(
    ride_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    ride_repo: SQLRideRepository = Depends(get_ride_repo),
    event_bus: RedisEventBus = Depends(get_event_bus)
):
    # Retrieve ride to check ownership
    ride = await ride_repo.get_by_id(ride_id)
    if not ride:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ride not found")
        
    if ride.rider_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    use_case = CancelRideUseCase(ride_repo, event_bus)
    try:
        await use_case.execute(ride_id)
        updated_ride = await ride_repo.get_by_id(ride_id)
        return RideResponse.model_validate(RideDTO.from_domain(updated_ride))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/history", response_model=List[RideResponse])
async def get_ride_history(
    current_user: User = Depends(get_current_user),
    ride_repo: SQLRideRepository = Depends(get_ride_repo)
):
    rides = await ride_repo.get_rides_by_rider(current_user.id)
    return [RideResponse.model_validate(RideDTO.from_domain(r)) for r in rides]
