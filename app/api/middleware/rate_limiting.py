import os
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
import redis.asyncio as redis

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "100"))

class RateLimitingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.redis_client = redis.from_url(REDIS_URL)

    async def dispatch(self, request: Request, call_next):
        # Allow websocket handshake to pass rate limits easily
        if request.headers.get("upgrade", "").lower() == "websocket":
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        redis_key = f"rate_limit:{client_ip}"
        
        try:
            current_requests = await self.redis_client.incr(redis_key)
            if current_requests == 1:
                # Expire key in 60 seconds
                await self.redis_client.expire(redis_key, 60)
            
            if current_requests > RATE_LIMIT_PER_MINUTE:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Try again in a minute."
                )
        except redis.RedisError:
            # Fallback gracefully if Redis is down
            pass

        return await call_next(request)
