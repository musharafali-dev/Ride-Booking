from app.domain.value_objects.location import Location

class ETAService:
    def calculate_eta_minutes(self, start: Location, destination: Location, 
                              average_speed_kmh: float = 30.0) -> int:
        """
        Estimates the travel time between two coordinates in minutes, assuming an average speed.
        """
        distance_km = start.distance_to(destination)
        if distance_km == 0:
            return 0
            
        time_hours = distance_km / average_speed_kmh
        time_minutes = time_hours * 60.0
        
        # Round up to the nearest minute, minimum 1 minute if distance > 0
        return max(1, int(round(time_minutes)))
