import json
import os
from typing import Any
import redis.asyncio as redis

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

class RedisEventBus:
    def __init__(self):
        self.redis_client = redis.from_url(REDIS_URL, decode_responses=True)

    async def publish(self, channel: str, event_object: Any) -> None:
        """
        Publishes a domain event object serialized into JSON.
        """
        # Convert event object to simple dict
        data = {
            "event_type": event_object.__class__.__name__,
            "data": {k: str(v) for k, v in event_object.__dict__.items() if k != 'occurred_at'},
            "occurred_at": str(event_object.occurred_at)
        }
        await self.redis_client.publish(channel, json.dumps(data))

    async def publish_raw(self, channel: str, payload: dict) -> None:
        """
        Publishes a raw dict payload.
        """
        await self.redis_client.publish(channel, json.dumps(payload))

    def get_pubsub(self):
        """
        Returns an active PubSub object to listen to channels.
        """
        return self.redis_client.pubsub()
