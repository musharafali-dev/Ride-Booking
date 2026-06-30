from decimal import Decimal
from app.domain.value_objects.location import Location
from app.domain.value_objects.money import Money

class PricingService:
    def __init__(self, base_fare: Decimal = Decimal("2.50"),
                 per_km_rate: Decimal = Decimal("1.20"),
                 per_minute_rate: Decimal = Decimal("0.25")):
        self.base_fare = base_fare
        self.per_km_rate = per_km_rate
        self.per_minute_rate = per_minute_rate

    def estimate_fare(self, pickup: Location, destination: Location, 
                      surge_multiplier: float = 1.0, 
                      ride_type_factor: float = 1.0) -> Money:
        """
        Calculates fare based on geodesic distance, average speed assumption, and surge rates.
        """
        distance_km = pickup.distance_to(destination)
        
        # Estimate duration assuming an average city speed of 40 km/h
        estimated_duration_minutes = (distance_km / 40.0) * 60.0
        
        distance_cost = Decimal(str(distance_km)) * self.per_km_rate
        time_cost = Decimal(str(estimated_duration_minutes)) * self.per_minute_rate
        
        subtotal = self.base_fare + distance_cost + time_cost
        total = subtotal * Decimal(str(surge_multiplier)) * Decimal(str(ride_type_factor))
        
        return Money(total, "USD")
