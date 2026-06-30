from fastapi import FastAPI
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.users import router as users_router
from app.api.v1.endpoints.rides import router as rides_router
from app.api.v1.endpoints.drivers import router as drivers_router
from app.api.v1.endpoints.admin import router as admin_router
from app.api.v1.endpoints.payments import router as payments_router
from app.api.websockets.router import router as ws_router
from app.api.middleware.logging import StructuredLoggingMiddleware
from app.api.middleware.rate_limiting import RateLimitingMiddleware
from app.api.middleware.cors import setup_cors

app = FastAPI(
    title="Clean Ride Sharing API",
    description="Production-ready asynchronous API built with FastAPI",
    version="1.0.0"
)

# Apply Middlewares
app.add_middleware(StructuredLoggingMiddleware)
app.add_middleware(RateLimitingMiddleware)
setup_cors(app)

# Register Endpoints
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(rides_router, prefix="/api/v1")
app.include_router(drivers_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(payments_router, prefix="/api/v1")
app.include_router(ws_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Ride Sharing API", "docs": "/docs"}
