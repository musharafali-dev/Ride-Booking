import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.entities.payment import Payment
from app.domain.value_objects.money import Money
from app.domain.repositories.payment_repo import PaymentRepository
from app.infrastructure.database.models.payment_model import PaymentModel

class SQLPaymentRepository(PaymentRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, payment_id: uuid.UUID) -> Optional[Payment]:
        result = await self.session.execute(
            select(PaymentModel).where(PaymentModel.id == payment_id)
        )
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None

    async def get_by_ride_id(self, ride_id: uuid.UUID) -> Optional[Payment]:
        result = await self.session.execute(
            select(PaymentModel).where(PaymentModel.ride_id == ride_id)
        )
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None

    async def save(self, payment: Payment) -> None:
        result = await self.session.execute(
            select(PaymentModel).where(PaymentModel.id == payment.id)
        )
        model = result.scalar_one_or_none()

        if not model:
            model = PaymentModel(
                id=payment.id,
                ride_id=payment.ride_id,
                user_id=payment.user_id,
                amount=float(payment.amount.amount),
                currency=payment.amount.currency,
                status=payment.status,
                method=payment.method,
                transaction_reference=payment.transaction_reference,
                created_at=payment.created_at,
                updated_at=payment.updated_at
            )
            self.session.add(model)
        else:
            model.status = payment.status
            model.transaction_reference = payment.transaction_reference
            model.updated_at = payment.updated_at

    def _to_domain(self, model: PaymentModel) -> Payment:
        amount = Money(model.amount, model.currency)
        return Payment(
            id=model.id,
            ride_id=model.ride_id,
            user_id=model.user_id,
            amount=amount,
            method=model.method,
            status=model.status,
            transaction_reference=model.transaction_reference,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
