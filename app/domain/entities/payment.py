from dataclasses import dataclass, field
import uuid
from datetime import datetime
from enum import Enum
from typing import Optional
from app.domain.value_objects.money import Money

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethod(str, Enum):
    CREDIT_CARD = "credit_card"
    DIGITAL_WALLET = "digital_wallet"
    CASH = "cash"

@dataclass
class Payment:
    ride_id: uuid.UUID
    user_id: uuid.UUID
    amount: Money
    method: PaymentMethod
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    status: PaymentStatus = PaymentStatus.PENDING
    transaction_reference: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def complete(self, reference: str):
        self.status = PaymentStatus.COMPLETED
        self.transaction_reference = reference
        self.updated_at = datetime.utcnow()

    def fail(self):
        self.status = PaymentStatus.FAILED
        self.updated_at = datetime.utcnow()

    def refund(self):
        if self.status != PaymentStatus.COMPLETED:
            raise ValueError("Only completed payments can be refunded.")
        self.status = PaymentStatus.REFUNDED
        self.updated_at = datetime.utcnow()
