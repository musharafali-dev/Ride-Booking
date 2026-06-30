import asyncio
import json
from fastapi import WebSocket, WebSocketDisconnect
from app.infrastructure.messaging.redis_pubsub import RedisEventBus

class RideTrackingHandler:
    def __init__(self, event_bus: RedisEventBus):
        self.event_bus = event_bus

    async def handle_connection(self, websocket: WebSocket, ride_id: str):
        await websocket.accept()
        pubsub = self.event_bus.get_pubsub()
        
        # Subscribe to general ride event updates and driver movements
        await pubsub.subscribe("ride_events")
        
        # We can dynamically listen to location changes.
        # For simplicity, we also listen to driver locations.
        # The client will pass messages to register their driver.
        await websocket.send_json({"status": "connected", "message": f"Tracking ride {ride_id}"})
        
        async def read_from_redis():
            try:
                async for message in pubsub.listen():
                    if message["type"] == "message":
                        data = json.loads(message["data"])
                        # Simple filter to only send relevant updates to this ride
                        if data.get("ride_id") == ride_id or "driver_id" in data:
                            await websocket.send_json(data)
            except asyncio.CancelledError:
                pass
            except Exception as e:
                # Log socket sending errors
                pass

        task = asyncio.create_task(read_from_redis())
        
        try:
            while True:
                # Maintain connection alive and listen to incoming client data (e.g. driver coordinates)
                data = await websocket.receive_text()
                # Parse incoming coordinates if driver is sending updates directly
                payload = json.loads(data)
                if payload.get("action") == "ping":
                    await websocket.send_json({"status": "pong"})
        except WebSocketDisconnect:
            pass
        finally:
            task.cancel()
            await pubsub.unsubscribe("ride_events")
            await pubsub.close()
