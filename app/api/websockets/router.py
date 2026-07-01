from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.api.websockets.handlers.notifications import NotificationsHandler
from app.api.deps import event_bus

router = APIRouter(prefix="/ws", tags=["WebSockets"])

# Instantiate WebSocket connection managers
notifier = NotificationsHandler(event_bus)

@router.websocket("/notifications/{user_id}")
async def websocket_notifications(websocket: WebSocket, user_id: str):
    await notifier.handle_connection(websocket, user_id)
