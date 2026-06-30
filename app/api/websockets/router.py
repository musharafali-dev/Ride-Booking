from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.api.websockets.handlers.ride_tracking import RideTrackingHandler
from app.api.websockets.handlers.notifications import NotificationsHandler
from app.api.deps import event_bus

router = APIRouter(prefix="/ws", tags=["WebSockets"])

# Instantiate WebSocket connection managers
ride_tracker = RideTrackingHandler(event_bus)
notifier = NotificationsHandler(event_bus)

@router.websocket("/rides/{ride_id}/track")
async def websocket_ride_tracking(websocket: WebSocket, ride_id: str):
    await ride_tracker.handle_connection(websocket, ride_id)

@router.websocket("/notifications/{user_id}")
async def websocket_notifications(websocket: WebSocket, user_id: str):
    await notifier.handle_connection(websocket, user_id)
