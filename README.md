# clean-architecture-ride-sharing-boilerplate

SwiftRide is a component-based, production-ready Ride Sharing Application boilerplate. It is built using clean architecture principles, domain-driven design, FastAPI (backend), and Reflex (frontend).

## Project Structure

```text
app/
├── api/                     # API routers, middleware & WS handlers
├── domain/                  # Pure DDD Layer (Entities, VO, Services, Events)
├── application/             # Use cases, Commands & Queries
├── infrastructure/          # Database, tasks, security & external adapters
└── presentation/            # Reflex Frontend App & States
```

## Running the Application

1. **Clone and Configure**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Verify running containers**:
   * API Backend: `http://localhost:8000/docs` (Swagger UI)
   * Frontend Application: `http://localhost:3000`
   * Redis Broker: `localhost:6379`
   * Postgres Database: `localhost:5432`

## Executing the Test Suite

Install dependencies and run tests:
```bash
poetry install
poetry run pytest tests/
```
