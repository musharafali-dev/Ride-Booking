from abc import ABC, abstractmethod
import uuid
from typing import Optional
from app.domain.entities.payment import Payment

class PaymentRepository(ABC):
    @abstractmethod
    async def get_by_id(self, payment_id: uuid.UUID) -> Optional[Payment]:
        pass

    @abstractmethod
    async def get_by_ride_id(self, ride_id: uuid.UUID) -> Optional[Payment]:
        pass

    @abstractmethod
    async def save(self, payment: Payment) -> None:
        pass
