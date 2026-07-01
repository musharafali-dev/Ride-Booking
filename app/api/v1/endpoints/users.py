from fastapi import APIRouter, Depends, HTTPException, status
from app.api.v1.schemas.users import UserResponse, UpdateProfileRequest
from app.api.deps import get_current_user, get_user_repo
from app.domain.entities.user import User
from app.infrastructure.repositories.sql_user_repo import SQLUserRepository

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email.value,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )

@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    request: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    user_repo: SQLUserRepository = Depends(get_user_repo)
):
    current_user.full_name = request.full_name
    await user_repo.save(current_user)
    return UserResponse(
        id=current_user.id,
        email=current_user.email.value,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )
