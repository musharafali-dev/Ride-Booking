from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid
from app.api.v1.schemas.users import UserResponse, DriverResponse
from app.api.deps import get_current_user, get_user_repo, get_driver_repo
from app.domain.entities.user import User, UserRole
from app.infrastructure.repositories.sql_user_repo import SQLUserRepository, SQLDriverRepository
from sqlalchemy import select
from app.infrastructure.database.models.user_model import UserModel

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Operation restricted to administrators only"
        )
    return current_user

@router.get("/users", response_model=List[UserResponse], dependencies=[Depends(require_admin)])
async def list_users(user_repo: SQLUserRepository = Depends(get_user_repo)):
    # Retrieve all users directly from session
    result = await user_repo.session.execute(select(UserModel).order_by(UserModel.created_at.desc()))
    models = result.scalars().all()
    return [user_repo._to_domain(m) for m in models]

@router.put("/drivers/{driver_id}/verify", response_model=DriverResponse, dependencies=[Depends(require_admin)])
async def verify_driver(
    driver_id: uuid.UUID,
    driver_repo: SQLDriverRepository = Depends(get_driver_repo)
):
    driver = await driver_repo.get_by_id(driver_id)
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver not found")
        
    driver.verify_driver()
    await driver_repo.save(driver)
    return DriverResponse.model_validate(driver)

@router.get("/analytics/overview", dependencies=[Depends(require_admin)])
async def get_analytics_overview(
    user_repo: SQLUserRepository = Depends(get_user_repo),
    driver_repo: SQLDriverRepository = Depends(get_driver_repo)
):
    # Quick count query simulation
    from sqlalchemy import func
    from app.infrastructure.database.models.user_model import DriverModel
    from app.infrastructure.database.models.ride_model import RideModel
    
    users_count = (await user_repo.session.execute(select(func.count(UserModel.id)))).scalar() or 0
    drivers_count = (await user_repo.session.execute(select(func.count(DriverModel.id)))).scalar() or 0
    rides_count = (await user_repo.session.execute(select(func.count(RideModel.id)))).scalar() or 0
    
    return {
        "total_registered_users": users_count,
        "total_registered_drivers": drivers_count,
        "total_rides_processed": rides_count,
        "system_status": "healthy"
    }
