# type: ignore
import reflex as rx
import httpx
import json
import asyncio
from typing import Dict, Any, Optional
from app.presentation.states.auth_state import AuthState

API_BASE_URL = "http://localhost:8000/api/v1"

class RideState(rx.State):  # type: ignore
    pickup_lat: float = 37.7749
    pickup_lon: float = -122.4194
    dest_lat: float = 37.7892
    dest_lon: float = -122.4014
    
    # Fare estimation
    estimating: bool = False
    estimated_fare: float = 0.0
    distance_km: float = 0.0
    estimated_duration: float = 0.0
    
    # Active ride
    active_ride_id: str = ""
    status: str = "idle"  # idle, requested, accepted, arrived, in_progress, completed, cancelled
    driver_id: str = ""
    driver_lat: float = 0.0
    driver_lon: float = 0.0
    error_message: str = ""
    
    def set_pickup_lat(self, val: Any):
        try:
            self.pickup_lat = float(val)
        except (ValueError, TypeError):
            pass

    def set_pickup_lon(self, val: Any):
        try:
            self.pickup_lon = float(val)
        except (ValueError, TypeError):
            pass

    def set_dest_lat(self, val: Any):
        try:
            self.dest_lat = float(val)
        except (ValueError, TypeError):
            pass

    def set_dest_lon(self, val: Any):
        try:
            self.dest_lon = float(val)
        except (ValueError, TypeError):
            pass

    def set_status(self, val: str):
        self.status = val

    async def get_estimate(self):
        self.estimating = True
        self.error_message = ""
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{API_BASE_URL}/rides/estimate",
                    json={
                        "pickup_lat": self.pickup_lat,
                        "pickup_lon": self.pickup_lon,
                        "dest_lat": self.dest_lat,
                        "dest_lon": self.dest_lon
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    self.estimated_fare = data["estimated_fare_amount"]
                    self.distance_km = data["distance_km"]
                    self.estimated_duration = data["estimated_duration_minutes"]
                else:
                    self.error_message = "Failed to fetch ride estimate."
            except Exception:
                self.error_message = "Error reaching the estimation service."
            finally:
                self.estimating = False

    async def request_ride(self):
        self.status = "requested"
        self.error_message = ""
        
        # Access token from AuthState
        auth_state = await self.get_state(AuthState)
        token = auth_state.access_token
        
        async with httpx.AsyncClient() as client:
            try:
                headers = {"Authorization": f"Bearer {token}"}
                response = await client.post(
                    f"{API_BASE_URL}/rides/request",
                    json={
                        "pickup_lat": self.pickup_lat,
                        "pickup_lon": self.pickup_lon,
                        "dest_lat": self.dest_lat,
                        "dest_lon": self.dest_lon
                    },
                    headers=headers
                )
                if response.status_code == 201:
                    data = response.json()
                    self.active_ride_id = data["id"]
                    # Start tracking WebSocket
                    return rx.call_script(f"connectRideTracking('{self.active_ride_id}');")
                else:
                    self.status = "idle"
                    self.error_message = response.json().get("detail", "Request failed")
            except Exception as e:
                import traceback
                traceback.print_exc()
                self.status = "idle"
                self.error_message = f"Failed to communicate with ride controller: {str(e)}"

    def update_ride_state_from_ws(self, payload_str: str):
        payload = json.loads(payload_str)
        
        # Check matching ride status updates or driver location movements
        if "driver_id" in payload:
            self.driver_lat = float(payload.get("latitude", 0))
            self.driver_lon = float(payload.get("longitude", 0))
        
        if "event_type" in payload:
            evt = payload["event_type"]
            data = payload.get("data", {})
            if evt == "DriverAssigned":
                self.status = "accepted"
                self.driver_id = data.get("driver_id", "")
            elif evt == "RideCompleted":
                self.status = "completed"
            elif evt == "RideCancelled":
                self.status = "cancelled"
