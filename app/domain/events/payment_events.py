from dataclasses import dataclass
import uuid
from datetime import datetime
from app.domain.value_objects.money import Money

@dataclass(frozen=True, kw_only=True)
class PaymentEvent:
    occurred_at: datetime = datetime.utcnow()

@dataclass(frozen=True, kw_only=True)
class PaymentCompleted(PaymentEvent):
    payment_id: uuid.UUID
    ride_id: uuid.UUID
    user_id: uuid.UUID
    amount: Money
    transaction_reference: str

@dataclass(frozen=True, kw_only=True)
class PaymentFailed(PaymentEvent):
    payment_id: uuid.UUID
    ride_id: uuid.UUID
    user_id: uuid.UUID
    amount: Money
    error_message: str
