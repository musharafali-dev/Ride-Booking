import uuid
from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database.session import get_async_session
from app.infrastructure.repositories.sql_user_repo import SQLUserRepository, SQLDriverRepository
from app.infrastructure.repositories.sql_ride_repo import SQLRideRepository
from app.infrastructure.repositories.sql_payment_repo import SQLPaymentRepository
from app.infrastructure.authentication.jwt_handler import JWTHandler
from app.infrastructure.authentication.hasher import PasswordHasher
from app.infrastructure.messaging.redis_pubsub import RedisEventBus
from app.domain.entities.user import User

security_agent = HTTPBearer()
jwt_handler = JWTHandler()
password_hasher = PasswordHasher()
event_bus = RedisEventBus()

async def get_db_session(session: AsyncSession = Depends(get_async_session)) -> AsyncSession:
    return session

def get_user_repo(session: AsyncSession = Depends(get_db_session)) -> SQLUserRepository:
    return SQLUserRepository(session)

def get_driver_repo(session: AsyncSession = Depends(get_db_session)) -> SQLDriverRepository:
    return SQLDriverRepository(session)

def get_ride_repo(session: AsyncSession = Depends(get_db_session)) -> SQLRideRepository:
    return SQLRideRepository(session)

def get_payment_repo(session: AsyncSession = Depends(get_db_session)) -> SQLPaymentRepository:
    return SQLPaymentRepository(session)

def get_hasher() -> PasswordHasher:
    return password_hasher

def get_event_bus() -> RedisEventBus:
    return event_bus

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_agent),
    user_repo: SQLUserRepository = Depends(get_user_repo)
) -> User:
    token = credentials.credentials
    try:
        payload = jwt_handler.decode_token(token)
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token type"
            )
        user_id = uuid.UUID(payload.get("sub"))
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=str(e)
        )

    user = await user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user"
        )
    return user
