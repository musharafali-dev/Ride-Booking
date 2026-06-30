from fastapi import APIRouter, Depends, HTTPException, status
import uuid
from app.api.deps import get_current_user, get_payment_repo, get_ride_repo, get_event_bus
from app.domain.entities.user import User
from app.domain.entities.payment import Payment, PaymentMethod, PaymentStatus
from app.infrastructure.repositories.sql_payment_repo import SQLPaymentRepository
from app.infrastructure.repositories.sql_ride_repo import SQLRideRepository
from app.infrastructure.payments.payment_gateway import PaymentGateway
from app.infrastructure.messaging.redis_pubsub import RedisEventBus
from app.domain.events.payment_events import PaymentCompleted, PaymentFailed

router = APIRouter(prefix="/payments", tags=["Payments"])
gateway = PaymentGateway()

@router.post("/process", status_code=status.HTTP_200_OK)
async def process_payment(
    ride_id: uuid.UUID,
    method: PaymentMethod,
    source_token: str = "tok_visa",
    current_user: User = Depends(get_current_user),
    payment_repo: SQLPaymentRepository = Depends(get_payment_repo),
    ride_repo: SQLRideRepository = Depends(get_ride_repo),
    event_bus: RedisEventBus = Depends(get_event_bus)
):
    ride = await ride_repo.get_by_id(ride_id)
    if not ride:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ride not found")
        
    if ride.rider_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Create Payment domain aggregate
    payment = Payment(
        ride_id=ride.id,
        user_id=current_user.id,
        amount=ride.estimated_fare,
        method=method
    )
    
    # Process through Stripe Mock Gateway
    result = await gateway.charge(
        amount=payment.amount.amount,
        currency=payment.amount.currency,
        source_token=source_token
    )
    
    if result["success"]:
        payment.complete(result["transaction_id"])
        await payment_repo.save(payment)
        
        # Dispatch event
        event = PaymentCompleted(
            payment_id=payment.id,
            ride_id=payment.ride_id,
            user_id=payment.user_id,
            amount=payment.amount,
            transaction_reference=result["transaction_id"]
        )
        await event_bus.publish("payment_events", event)
        return {"status": "success", "transaction_reference": result["transaction_id"]}
    else:
        payment.fail()
        await payment_repo.save(payment)
        
        event = PaymentFailed(
            payment_id=payment.id,
            ride_id=payment.ride_id,
            user_id=payment.user_id,
            amount=payment.amount,
            error_message="Gateway transaction declined"
        )
        await event_bus.publish("payment_events", event)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Payment failed")
