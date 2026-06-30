import uuid
from decimal import Decimal
from typing import Dict, Any
import httpx
import os

class PaymentGateway:
    def __init__(self):
        self.api_key = os.getenv("PAYMENT_GATEWAY_API_KEY", "mock_key")

    async def charge(self, amount: Decimal, currency: str, source_token: str) -> Dict[str, Any]:
        """
        Processes a charge against a client payment method.
        Fails back to mock processing if the API key is not configured.
        """
        if self.api_key == "mock_key":
            return {
                "success": True,
                "transaction_id": f"txn_{uuid.uuid4().hex[:12]}",
                "message": "Mock payment processed successfully",
                "amount": float(amount),
                "currency": currency
            }

        async with httpx.AsyncClient() as client:
            # Placeholder for calling a payment processor like Stripe API
            # url = "https://api.stripe.com/v1/charges"
            # headers = {"Authorization": f"Bearer {self.api_key}"}
            # payload = {"amount": int(amount * 100), "currency": currency, "source": source_token}
            # response = await client.post(url, headers=headers, data=payload)
            # data = response.json()
            # return {"success": response.status_code == 200, "transaction_id": data.get("id")}
            pass
