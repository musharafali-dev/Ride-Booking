import asyncio
import json
from fastapi import WebSocket, WebSocketDisconnect
from app.infrastructure.messaging.redis_pubsub import RedisEventBus

class NotificationsHandler:
    def __init__(self, event_bus: RedisEventBus):
        self.event_bus = event_bus

    async def handle_connection(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        pubsub = self.event_bus.get_pubsub()
        
        # Subscribe to user's private notification channel
        channel = f"notifications:{user_id}"
        await pubsub.subscribe(channel)
        
        await websocket.send_json({"status": "connected", "message": "Listening for notifications"})

        async def redis_listener():
            try:
                async for message in pubsub.listen():
                    if message["type"] == "message":
                        data = json.loads(message["data"])
                        await websocket.send_json(data)
            except asyncio.CancelledError:
                pass
            except Exception:
                pass

        task = asyncio.create_task(redis_listener())

        try:
            while True:
                # Keep socket open and process any incoming heartbeats
                data = await websocket.receive_text()
                payload = json.loads(data)
                if payload.get("action") == "ping":
                    await websocket.send_json({"status": "pong"})
        except WebSocketDisconnect:
            pass
        finally:
            task.cancel()
            await pubsub.unsubscribe(channel)
            await pubsub.close()
        
