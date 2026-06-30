from abc import ABC, abstractmethod
import uuid
from typing import Optional, List
from app.domain.entities.user import User
from app.domain.entities.driver import Driver, DriverStatus

class UserRepository(ABC):
    @abstractmethod
    async def get_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        pass

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        pass

    @abstractmethod
    async def save(self, user: User) -> None:
        pass

class DriverRepository(ABC):
    @abstractmethod
    async def get_by_id(self, driver_id: uuid.UUID) -> Optional[Driver]:
        pass

    @abstractmethod
    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[Driver]:
        pass

    @abstractmethod
    async def get_drivers_by_status(self, status: DriverStatus) -> List[Driver]:
        pass

    @abstractmethod
    async def save(self, driver: Driver) -> None:
        pass
