import httpx
import os
from typing import Dict, Any

class MapService:
    def __init__(self):
        self.api_key = os.getenv("MAP_SERVICE_API_KEY", "mock_key")
        self.base_url = "https://maps.googleapis.com/maps/api"

    async def get_route_distance_and_duration(self, origin_lat: float, origin_lon: float, 
                                             dest_lat: float, dest_lon: float) -> Dict[str, Any]:
        """
        Retrieves routing metrics from the external mapping APIs.
        Fails back to straight-line Euclidean distance if the API key is a mock.
        """
        if self.api_key == "mock_key":
            # Fallback estimation rules
            import math
            lat_diff = dest_lat - origin_lat
            lon_diff = dest_lon - origin_lon
            # Simple conversion factor: roughly 111km per degree
            distance_km = math.sqrt(lat_diff**2 + lon_diff**2) * 111.0
            duration_minutes = (distance_km / 35.0) * 60.0  # Assumes 35 km/h avg speed
            
            return {
                "distance_km": round(distance_km, 2),
                "duration_minutes": round(duration_minutes, 1),
                "provider": "mock_engine"
            }
            
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/distancematrix/json"
            params = {
                "origins": f"{origin_lat},{origin_lon}",
                "destinations": f"{dest_lat},{dest_lon}",
                "key": self.api_key
            }
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Parse responses
            element = data["rows"][0]["elements"][0]
            distance_meters = element["distance"]["value"]
            duration_seconds = element["duration"]["value"]
            
            return {
                "distance_km": round(distance_meters / 1000.0, 2),
                "duration_minutes": round(duration_seconds / 60.0, 1),
                "provider": "google_maps"
            }
class MapService:
    def __init__(self):
        self.api_key = os.getenv("MAP_SERVICE_API_KEY", "mock_key")
        self.base_url = "https://maps.googleapis.com/maps/api"

    async def get_route_distance_and_duration(self, origin_lat: float, origin_lon: float, 
                                             dest_lat: float, dest_lon: float) -> Dict[str, Any]:
        """
        Retrieves routing metrics from the external mapping APIs.
        Fails back to straight-line Euclidean distance if the API key is a mock.
        """
        if self.api_key == "mock_key":
            # Fallback estimation rules
            import math
            lat_diff = dest_lat - origin_lat
            lon_diff = dest_lon - origin_lon
            # Simple conversion factor: roughly 111km per degree
            distance_km = math.sqrt(lat_diff**2 + lon_diff**2) * 111.0
            duration_minutes = (distance_km / 35.0) * 60.0  # Assumes 35 km/h avg speed
            
            return {
                "distance_km": round(distance_km, 2),
                "duration_minutes": round(duration_minutes, 1),
                "provider": "mock_engine"
            }
            
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/distancematrix/json"
            params = {
                "origins": f"{origin_lat},{origin_lon}",
                "destinations": f"{dest_lat},{dest_lon}",
                "key": self.api_key
            }
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Parse responses
            element = data["rows"][0]["elements"][0]
            distance_meters = element["distance"]["value"]
            duration_seconds = element["duration"]["value"]
            
            return {
                "distance_km": round(distance_meters / 1000.0, 2),
                "duration_minutes": round(duration_seconds / 60.0, 1),
                "provider": "google_maps"
            }
