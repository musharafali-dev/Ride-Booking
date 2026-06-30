import time
import structlog
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.PrintLoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

class StructuredLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Capture request context
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            method=request.method,
            path=request.url.path,
            ip=request.client.host if request.client else "unknown"
        )
        
        try:
            response = await call_next(request)
            duration = time.time() - start_time
            logger.info("request_completed", status_code=response.status_code, duration_ms=round(duration * 1000, 2))
            return response
        except Exception as e:
            duration = time.time() - start_time
            logger.error("request_failed", error=str(e), duration_ms=round(duration * 1000, 2))
            raise
