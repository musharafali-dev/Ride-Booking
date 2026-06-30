from dataclasses import dataclass
from decimal import Decimal

@dataclass(frozen=True)
class Money:
    amount: Decimal
    currency: str = "USD"

    def __post_init__(self):
        # Convert to Decimal if float/int is passed in
        object.__setattr__(self, 'amount', Decimal(str(self.amount)).quantize(Decimal('0.01')))
        if self.amount < 0:
            raise ValueError("Money amount cannot be negative.")
        if not self.currency or len(self.currency) != 3:
            raise ValueError("Currency must be a 3-letter ISO code.")

    def __add__(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise ValueError("Cannot add money of different currencies.")
        return Money(self.amount + other.amount, self.currency)

    def __sub__(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise ValueError("Cannot subtract money of different currencies.")
        if self.amount < other.amount:
            raise ValueError("Resulting money cannot be negative.")
        return Money(self.amount - other.amount, self.currency)

    def multiply_by(self, factor: float) -> 'Money':
        return Money(self.amount * Decimal(str(factor)), self.currency)
