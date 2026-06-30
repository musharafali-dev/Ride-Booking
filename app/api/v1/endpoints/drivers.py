from fastapi import APIRouter, Depends, HTTPException, status
import uuid
from app.api.v1.schemas.users import DriverResponse, DriverRegisterRequest
from app.api.v1.schemas.rides import RideResponse
from app.api.v1.schemas.common import MessageResponse
from app.api.deps import get_current_user, get_driver_repo, get_ride_repo, get_event_bus
from app.domain.entities.user import User, UserRole
from app.domain.entities.driver import Driver, DriverStatus
from app.domain.entities.vehicle import Vehicle
from app.infrastructure.repositories.sql_user_repo import SQLDriverRepository
from app.infrastructure.repositories.sql_ride_repo import SQLRideRepository
from app.infrastructure.messaging.redis_pubsub import RedisEventBus
from app.application.use_cases.driver.accept_ride import AcceptRideUseCase
from app.application.use_cases.ride.complete_ride import CompleteRideUseCase
from app.application.dto.ride_dto import RideDTO

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.post("/register", response_model=DriverResponse, status_code=status.HTTP_201_CREATED)
async def register_driver(
    request: DriverRegisterRequest,
    current_user: User = Depends(get_current_user),
    driver_repo: SQLDriverRepository = Depends(get_driver_repo)
):
    if current_user.role != UserRole.DRIVER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="User role must be DRIVER to register a driver profile"
        )
        
    existing = await driver_repo.get_by_user_id(current_user.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Driver profile already exists for this user"
        )

    vehicle = Vehicle(
        make=request.vehicle_make,
        model=request.vehicle_model,
        year=request.vehicle_year,
        color=request.vehicle_color,
        license_plate=request.vehicle_license_plate
    )
    
    driver = Driver(
        user_id=current_user.id,
        license_number=request.license_number,
        vehicle=vehicle
    )
    
    await driver_repo.save(driver)
    return DriverResponse.model_validate(driver)

@router.get("/me", response_model=DriverResponse)
async def get_driver_profile(
    current_user: User = Depends(get_current_user),
    driver_repo: SQLDriverRepository = Depends(get_driver_repo)
):
    driver = await driver_repo.get_by_user_id(current_user.id)
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver profile not found")
    return DriverResponse.model_validate(driver)

@router.put("/me/availability", response_model=DriverResponse)
async def toggle_availability(
    online: bool,
    current_user: User = Depends(get_current_user),
    driver_repo: SQLDriverRepository = Depends(get_driver_repo)
):
    driver = await driver_repo.get_by_user_id(current_user.id)
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver profile not found")
        
    if online:
        driver.go_online()
    else:
        driver.go_offline()
        
    await driver_repo.save(driver)
    return DriverResponse.model_validate(driver)

@router.post("/rides/{ride_id}/accept", response_model=RideResponse)
async def accept_ride(
    ride_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    ride_repo: SQLRideRepository = Depends(get_ride_repo),
    driver_repo: SQLDriverRepository = Depends(get_driver_repo),
    event_bus: RedisEventBus = Depends(get_event_bus)
):
    driver = await driver_repo.get_by_user_id(current_user.id)
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver profile not found")
        
    use_case = AcceptRideUseCase(ride_repo, driver_repo, event_bus)
    try:
        ride = await use_case.execute(ride_id, driver.id)
        return RideResponse.model_validate(RideDTO.from_domain(ride))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/rides/{ride_id}/complete", response_model=RideResponse)
async def complete_ride(
    ride_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    ride_repo: SQLRideRepository = Depends(get_ride_repo),
    driver_repo: SQLDriverRepository = Depends(get_driver_repo),
    event_bus: RedisEventBus = Depends(get_event_bus)
):
    driver = await driver_repo.get_by_user_id(current_user.id)
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver profile not found")
        
    use_case = CompleteRideUseCase(ride_repo, driver_repo, event_bus)
    try:
        ride = await use_case.execute(ride_id, driver.id)
        return RideResponse.model_validate(RideDTO.from_domain(ride))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
