from typing import List, Optional
from app.domain.entities.ride import Ride
from app.domain.entities.driver import Driver, DriverStatus

class MatchingService:
    def find_best_driver(self, ride: Ride, available_drivers: List[Driver], max_radius_km: float = 10.0) -> Optional[Driver]:
        """
        Finds the closest online driver within a given radius.
        """
        best_driver: Optional[Driver] = None
        closest_distance = max_radius_km

        for driver in available_drivers:
            if driver.status != DriverStatus.ONLINE or not driver.current_location:
                continue

            distance = ride.pickup_location.distance_to(driver.current_location)
            if distance <= closest_distance:
                closest_distance = distance
                best_driver = driver

        return best_driver
