import pytest
from decimal import Decimal
from app.domain.value_objects.location import Location
from app.domain.services.pricing_service import PricingService

def test_estimate_fare_calculation():
    # San Francisco Coordinates
    pickup = Location(37.7749, -122.4194)
    destination = Location(37.7892, -122.4014) # ~2.2 km away
    
    pricing = PricingService(
        base_fare=Decimal("2.50"),
        per_km_rate=Decimal("1.20"),
        per_minute_rate=Decimal("0.25")
    )
    
    fare = pricing.estimate_fare(pickup, destination, surge_multiplier=1.0)
    
    # Distance is approx 2.2km. Base = 2.50. Distance cost = 2.2 * 1.20 = 2.64.
    # Speed is 40km/h. Duration = (2.2 / 40) * 60 = 3.3 minutes. Time cost = 3.3 * 0.25 = 0.825.
    # Total = 2.50 + 2.64 + 0.825 = 5.965 -> quantized to 5.97.
    assert fare.amount > Decimal("5.00")
    assert fare.amount < Decimal("7.00")
    assert fare.currency == "USD"

def test_pricing_surge_multiplier():
    pickup = Location(37.7749, -122.4194)
    destination = Location(37.7892, -122.4014)
    
    pricing = PricingService()
    
    standard_fare = pricing.estimate_fare(pickup, destination, surge_multiplier=1.0)
    surge_fare = pricing.estimate_fare(pickup, destination, surge_multiplier=2.0)
    
    assert abs(surge_fare.amount - standard_fare.amount * Decimal("2.00")) <= Decimal("0.02")

def test_invalid_location_values():
    with pytest.raises(ValueError):
        Location(95.0, 0.0) # Lat out of bounds

    with pytest.raises(ValueError):
        Location(0.0, -190.0) # Lon out of bounds
